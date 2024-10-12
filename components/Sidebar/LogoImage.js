import { FontAwesomeIcon } from "../../app/fontAwesome.js";

function LogoImage({ logoUrl, name }) {
  return logoUrl ? (
    <img
      src={logoUrl}
      alt={`${name} logo`}
      style={{
        maxWidth: "12vw",
        maxHeight: "90px",
        width: "auto",
        height: "auto",
        objectFit: "contain",
        borderRadius: "45px",
        marginRight: "20px",
      }}
    />
  ) : (
    <FontAwesomeIcon
      icon={["far", "user"]}
      style={{
        maxWidth: "12vw",
        maxHeight: "90px",
        width: "auto",
        height: "auto",
        marginLeft: "10px",
        marginRight: "20px",
      }}
    />
  );
}

export default LogoImage;
