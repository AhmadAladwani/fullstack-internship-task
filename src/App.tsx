import { useEffect, useState } from "react"
import AddOrEditButton from "./components/AddOrEditButton"
import emailjs from "@emailjs/browser"
import LoadingSpinner from "./components/LoadingSpinner"

export type User = {
    _id: string,
    name: string,
    phoneNumber: string,
    email: string,
    hobbies: string,
}

export default function App() {
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedUsers, setSelectedUsers] = useState<User[]>([])
    const [sentEmail, setSentEmail] = useState(false)

    useEffect(() => {
        let ignore = false
        async function getUsers() {
            try {
                const response = await fetch('/api/users')
                if (!response.ok) {
                    throw response.statusText
                }
                const data: { users: User[] } = await response.json()
                const { users } = data
                if (!ignore) {
                    setUsers(users)
                }
            } catch (error) {
                setError(error as string)
            } finally {
                setLoading(false)
            }

        }
        getUsers()
        return () => {
            ignore = true
        }
    }, [])

    useEffect(() => {
        if (sentEmail) {
            const timeId = setTimeout(() => {
                setSentEmail(false)
            }, 3000)
            return () => {
                clearTimeout(timeId)
            }
        }
    }, [sentEmail])

    function handleCheckAll(event: React.ChangeEvent<HTMLInputElement>) {
        if (event.target.checked) {
            setSelectedUsers(users)
        } else {
            setSelectedUsers([])
        }
    }

    function modifySelectedUsers(event: React.ChangeEvent<HTMLInputElement>) {
        setSelectedUsers(prevSelectedUsers => {
            if (event.target.checked) {
                const user = users.find(user => user._id === event.target.value)
                if (!user) {
                    setError('User not found.')
                }
                const index = users.indexOf(user!)
                if (index === -1) {
                    setError('Cannot find the index of this user.')
                }
                const array = [...prevSelectedUsers]
                array.splice(index, 0, user!)
                return array
            } else {
                return prevSelectedUsers.filter(user => user._id !== event.target.value)
            }
        })
    }

    async function sendEmail() {
        setLoading(true)
        try {
            const selectedUsersString = selectedUsers.map(selectedUser => `\nID: ${selectedUser._id}, Name: ${selectedUser.name}, Phone number: ${selectedUser.phoneNumber}, Email: ${selectedUser.email}, Hobbies: ${selectedUser.hobbies}`)
            await emailjs.send(import.meta.env.VITE_SERVICE_ID, import.meta.env.VITE_TEMPLATE_ID, { from_name: 'Ahmad', to_name: 'Team RedPositive', message: `Here are the selected users: ${selectedUsersString}` }, import.meta.env.VITE_PUBLIC_KEY)
            setSentEmail(true)
        } catch (error) {
            setError(error as string)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <LoadingSpinner />
        )
    }

    if (error) {
        return (
            <div className="error-container">
                <h1><span className="error-text">Error:</span> {error.toString()}</h1>
                <a href="/">Return to home page.</a>
            </div>
        )
    }

    return (
        <div className="container">
            <table>
                <thead>
                    <tr>
                        <th>Select All <input className="select-all-input" type="checkbox" checked={selectedUsers.length === users.length} onChange={(e) => handleCheckAll(e)} /></th>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Phone Number</th>
                        <th>Email</th>
                        <th>Hobbies</th>
                        <th>Update / Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length > 0 && users.map(user => {
                        return (
                            <tr key={user._id}>
                                <td><input className="select-user-input" type="checkbox" value={user._id} checked={selectedUsers.includes(user)} onChange={(e) => modifySelectedUsers(e)} /></td>
                                <td>{user._id}</td>
                                <td>{user.name}</td>
                                <td>{user.phoneNumber}</td>
                                <td>{user.email}</td>
                                <td>{user.hobbies}</td>
                                <td><AddOrEditButton _id={user._id} setUsers={setUsers} setError={setError} /></td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            {selectedUsers.length > 0 &&
                <>
                    <h1 className="selected-users-title">Selected users:</h1>
                    {selectedUsers.map(selectedUser => {
                        return (
                            <div key={selectedUser._id} className="selected-users-container">
                                <h2 className="selected-user">{selectedUser.name}</h2>
                            </div>
                        )
                    })}
                </>
            }
            <button className="send-selected-users-button" onClick={() => sendEmail()}>Send Selected Users</button>
            {sentEmail && <h1 className="email-message">Message sent successfully!</h1>}
            <AddOrEditButton setUsers={setUsers} setError={setError} />
        </div>
    )
}