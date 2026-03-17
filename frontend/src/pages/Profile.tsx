import { useParams } from "react-router-dom"

export default function Profile() {
  const { id } = useParams()

  return (
    <div style={{ padding: 20 }}>
      <h2>User Profile</h2>
      <p>User ID: {id}</p>
    </div>
  )
}