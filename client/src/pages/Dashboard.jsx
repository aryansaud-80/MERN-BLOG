import DashboardSideBar from "../components/DashboardSideBar/DashboardSideBar";
import DashboardProfile from "../components/DashboardProfile/DashboardProfile";

const Dashboard = () => {
  return (
    <section className="dashboard">
      <DashboardSideBar />
      <DashboardProfile />
    </section>
  );
};
export default Dashboard;
