export const validateEmail = (text: string) => {
    const emailRegex = /^[a-zA-Z]+([a-zA-Z0-9._-])*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;
    return emailRegex.test(text) && text.length !== 0;
  };

  export const validatePassword = (text: string) => {
      const pwdRegex = 	/^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/;
      return pwdRegex.test(text) && text.length >= 8;
  }