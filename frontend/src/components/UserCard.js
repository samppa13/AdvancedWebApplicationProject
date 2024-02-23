import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap/dist/css/bootstrap.min.css'

const UserCard = ({ user }) => {
    return (
        <div className='card text-bg-danger w-50'>
            <div className='card-header'>
                {user.username}
            </div>
            <div className='card-body'>
                <h5 className='card-title'>
                    {user.title}
                </h5>
                <p className='card-text'>
                    {user.information}
                </p>
            </div>
        </div>
    )
}

export default UserCard