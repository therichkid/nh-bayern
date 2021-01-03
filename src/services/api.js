import axios from "axios";

const wpInstance = axios.create({
  baseURL: "https://admin.nh-bayern.de/wp-json/",
  timeout: 7500
});

export default {
  async fetchData(path, params) {
    const response = await wpInstance.get(path, { params }).catch(error => {
      throw error;
    });
    return { data: response.data, headers: response.headers };
  },

  async postData(data, id) {
    const response = await axios.post("/includes/submit.php", { data, id }).catch(error => {
      if (typeof error === "string") {
        // Validation errors
        throw error;
      } else {
        console.error(error);
        throw defaultErrorMessage;
      }
    });
    const { success, message } = handleResponse(response);
    if (success) {
      return message;
    } else {
      throw message;
    }
  }
};

const defaultErrorMessage =
  "Leider ist etwas schiefgegangen. Bitte versuchen Sie es später noch einmal.";

const handleResponse = response => {
  if (response.data.status === "mail_sent") {
    return {
      success: true,
      message: "Ihr Formular wurde erfolgreich versendet. Vielen Dank!"
    };
  } else {
    console.error(response);
    return {
      success: false,
      message: response.data.message || defaultErrorMessage
    };
  }
};
