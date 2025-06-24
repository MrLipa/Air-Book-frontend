import { Navbar } from "@/components";
import { Footer } from "@/components";

export const Help = () => {
  return (
    <>
      <div className="wrapper">
        <Navbar />
        <div
          style={{
            margin: "auto",
            width: "70vw",
            marginTop: "20vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque
          ut elit a lectus euismod pretium ut in ipsum. Aliquam velit nisi,
          lobortis pellentesque sodales et, ornare eget augue. Nulla facilisi.
          Sed eleifend, neque sit amet posuere dictum, dolor eros luctus magna,
          vel maximus neque ipsum et diam. Quisque vulputate dapibus tortor quis
          fermentum. Nullam accumsan non nibh in placerat. Suspendisse et dolor
          congue dolor congue tempus eget in enim.
        </div>
      </div>
      <Footer />
    </>
  );
};
