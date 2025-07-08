import Banner from '../components/layouts/Banner'
import Header from '../components/layouts/Header'
import TopDoctors from '../pages/doctors/TopDoctors'

const Home = () => {
  return (
    <div>
      <Header />
      <TopDoctors />
      <Banner/>
    </div>
  )
}

export default Home