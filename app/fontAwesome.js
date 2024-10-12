import { library } from "@fortawesome/fontawesome-svg-core";
import { faUser as fasUser, faBuilding as fasBuilding } from "@fortawesome/free-solid-svg-icons";
import { faUser as farUser, faBuilding as farBuilding } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

library.add(fasUser, farUser, fasBuilding, farBuilding);

export { FontAwesomeIcon };
