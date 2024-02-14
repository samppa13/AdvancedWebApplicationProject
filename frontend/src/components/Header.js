import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap/dist/css/bootstrap.min.css'

const Header = ({ jwt }) => {
    const logout = () => {
        localStorage.removeItem('auth_token')
        window.location.href = '/'
    }
    return (
        <div className='dropdown'>
            <button className='btn btn-secondary dropdown-toggle' type='button' data-bs-toggle='dropdown' aria-expanded='false'>
                Menu
            </button>
            <ul className='dropdown-menu dropdown-menu-dark'>
                <li><a className='dropdown-item' href='/settings'>Edit your information</a></li>
                <li><a className='dropdown-item' href='/chats'>List your chats</a></li>
                <li><hr className='dropdown-divider' /></li>
                <li><button className='dropdown-item' type='button' onClick={logout}>Logout</button></li>
            </ul>
        </div>
    )
}

export default Header