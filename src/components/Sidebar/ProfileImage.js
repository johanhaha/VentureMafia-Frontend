import { FontAwesomeIcon } from "../../fontAwesome.js";

function ProfileImage({ personLogoUrl, name }) {
  return personLogoUrl ? (
    // eslint-disable-next-line jsx-a11y/img-redundant-alt
    <img
      src={personLogoUrl}
      alt={`${name} profile picture`}
      style={{
        width: "90px",
        height: "90px",
        objectFit: "cover",
        borderRadius: "45px",
        marginRight: "20px",
      }}
    />
  ) : (
    <FontAwesomeIcon
      icon={["far", "user"]}
      style={{
        width: "70px",
        height: "70px",
        marginLeft: "10px",
        marginRight: "30px",
        marginTop: "10px",
        marginBottom: "10px",
      }}
    />
  );
}

export default ProfileImage;
