
export const manageErrorCodeUser = (_errorCode, _errorMessage) => {
    switch (_errorCode) {
      case 'U000':
        return { code: _errorCode, message: _errorMessage };
      case 'U100':
        return { code: _errorCode, message: _errorMessage };
      case 'U001':
        return {  code: _errorCode, message: _errorMessage };
      case 'U010':
        return {  code: _errorCode, message: _errorMessage };
      case 'S000':
        return {  code: _errorCode, message: _errorMessage};
      default:
        return {  code: '000', message: 'Une erreur est survenue. Veuillez réessayer plus tard' };
    }
  };
  
  export const manageErrorCodeTaskAndSubtask = (_errorCode, _errorMessage) => {
    switch (_errorCode) {
      case 'UT000':
        return { code: _errorCode, message: _errorMessage };
      case 'US000':
        return {  code: _errorCode, message: _errorMessage };
      case 'UTS000':
        return {  code: _errorCode, message: _errorMessage };
      case 'UTS-000':
        return {  code: _errorCode, message: _errorMessage };
      default:
        return {  code: '000', message: 'Une erreur est survenue. Veuillez réessayer plus tard' };
    }
  };




