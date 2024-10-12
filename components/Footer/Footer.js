import FooterLabels from "./FooterLabels";
import FooterAuthor from "./FooterAuthor";

function Footer() {
  return (
    <footer
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 3fr",
        width: "100vw",
        height: "50px",
        overflow: "hidden",
      }}
    >
      <FooterAuthor />
      <FooterLabels />
    </footer>
  );
}

export default Footer;
