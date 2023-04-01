import "./combineComponent.scss";
import Header from "./header/header";
import MainContent from "./mainContent";
import SideMenu from "./sideMenu";

function CombineComponent() {
  return (
    <div className="combineComponent">
      <Header />
      <div className="combineComponent__container">
        <div className="combineComponent_sideMenu">
          <SideMenu />
        </div>
        <div className="combineComponent__mainContent">
          <MainContent />
        </div>
      </div>
    </div>
  );
}

export default CombineComponent;
