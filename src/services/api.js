import axios from "axios";

const wpInstance = axios.create({
  baseURL: "https://admin.bayciv.de/wp-json/",
  timeout: 7500
});
const n2gInstance = axios.create({
  baseURL: "https://api.newsletter2go.com/",
  timeout: 7500
});

export default {
  async fetchData(path, params) {
    const response = await wpInstance.get(path, { params }).catch(error => {
      throw error;
    });
    return { data: response.data, headers: response.headers };
  },

  // Post requests with reCAPTCHA check
  async postData(data, token, type, id) {
    // Get the path when reCAPTCHA is successful
    const path = await verify(token, type, id);
    if (path) {
      if (type === "form") {
        await cf7PostRequest(data, path).catch(error => {
          throw error;
        });
        return "Die Anmeldung war erfolgreich. Vielen Dank!";
      } else if (type === "newsletter") {
        await n2gPostRequest(data, path);
        return "Registrierung erfolgreich! Sie erhalten in Kürze eine E-Mail.";
      }
    } else {
      throw "Unbekannter Fehler.";
    }
  }
};

// Verify if the user is human
const verify = async (token, type, id) => {
  const response = await axios
    .post("/includes/verify.php", {
      token,
      type,
      id
    })
    .catch(error => {
      console.error(error);
      // Somehow catching the error message from the php file is not working...
      throw "reCAPTCHA-Prüfung war nicht erfolgreich. Bitte versuchen Sie es noch einmal.";
    });
  return response.data;
};

// CF7
const cf7PostRequest = async (data, restParam) => {
  const bodyFormData = new FormData();
  for (const key in data) {
    bodyFormData.set(key, data[key]);
  }
  const response = await wpInstance.post(restParam, bodyFormData).catch(error => {
    throw error;
  });
  // console.log("Post CF7 Data Successful", response);
  if (response.data.status === "mail_sent") {
    // Success
    return null;
  } else {
    // Error handling CF7
    throw response;
  }
};

// Newsletter2Go
const n2gPostRequest = async (fields, restParam) => {
  const email = fields["email"];
  const response = await n2gInstance
    .post(restParam, {
      recipient: {
        email
      }
    })
    .catch(error => {
      throw error;
    });
  // console.log("Post Newsletter2Go Data Successful", response);
  if (response.data.status === 201) {
    // Success
    return null;
  } else {
    let errorMessage;
    if (response.data.status === 200) {
      if (response.data.value.length) {
        // Only one recipient for each request -> 1st value of Array
        const errors = response.data.value[0].result.error;
        if (errors.failed) {
          if (errors.recipients.invalid.length) {
            errorMessage = "Die eingegebene E-Mail-Addresse ist ungültig.";
          } else if (errors.recipients.duplicate.length) {
            errorMessage = "Die eingegebene E-Mail-Addresse ist bereits registriert.";
          }
        }
      }
    }
    if (!errorMessage) {
      errorMessage = "Unbekannter Fehler.";
    }
    throw errorMessage;
  }
};
