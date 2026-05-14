// Méthodes utilitaires
const getStatusColor = (status: string) => {
  switch (status) {
    case "Actif":
      return "success";
    case "Inactif":
      return "warning";
    case "Suspendu":
      return "error";
    case "En attente":
      return "warning";
    default:
      return "grey";
  }
};

const getRandomColor = () => {
  let tabColor = ["error", "warning", "success", "primary", "info"];

  let index = Math.floor(Math.random() * tabColor.length);

  return tabColor[index];
};

const userHelper = {
  getStatusColor,
  getRandomColor,
};

export default userHelper;
