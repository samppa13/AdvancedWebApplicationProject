import UserCards from './UserCards'

const Home = () => {
    if (localStorage.getItem('auth_token')) {
        return (
            <UserCards />
        )
    }
    else {
        window.location.href = '/login'
    }
}

export default Home