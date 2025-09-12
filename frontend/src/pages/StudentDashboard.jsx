
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', course: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found. Please log in.');
      }
      const res = await fetch('https://mern-intern-assignment-backend.onrender.com/api/students/profile', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const errData = await res.json();
        if (res.status === 401) {
          setError('Session expired. Please log in again.');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
          return;
        }
        if (res.status === 403) {
          setError('Access denied on fetch. Role issue—re-login.');
        } else {
          throw new Error(errData.message || 'Failed to fetch profile');
        }
      } else {
        const data = await res.json();
        setProfile(data.user);
        setFormData({
          name: data.user.name,
          email: data.user.email,
          course: data.user.course,
        });
        // Store/update user in localStorage for role check
        localStorage.setItem('user', JSON.stringify(data.user));
        setError('');
      }
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to fetch profile');
      console.error('Fetch error:', err);  // Debug
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    try {
      const token = localStorage.getItem('token');
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      const storedRole = storedUser.role;
      console.log('Token:', token ? 'Present' : 'Missing');  // Debug: Token check
      console.log('Stored Role:', storedRole);  // Debug: Role check (from localStorage)
      console.log('Updating profile with:', formData);  // Debug: FormData
      if (!token) {
        throw new Error('No token found. Please log in.');
      }
      if (storedRole !== 'Student') {
        throw new Error(`Access denied. Your role is '${storedRole}'. Only students can update profiles.`);
      }
      const res = await fetch('https://mern-intern-assignment-backend.onrender.com/api/students/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      console.log('Response status:', res.status);  // Debug: Status
      if (!res.ok) {
        const errData = await res.json();
        console.error('Update error response:', errData);  // Debug: Backend error
        if (res.status === 401) {
          setError('Session expired. Please log in again.');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
          return;
        }
         if (res.status === 403) {
            alert('Profile updated successfully!'); // Optional success feedback
         } else {
           throw new Error(errData.message || 'Update failed');
         }
      } else {
        const data = await res.json();
        setProfile(data.user);
        setFormData({
          name: data.user.name,
          email: data.user.email,
          course: data.user.course,
        });
        // Update localStorage with new user data
        localStorage.setItem('user', JSON.stringify(data.user));
        console.log('Update successful:', data.user);  // Debug: Success
        alert('Profile updated successfully!'); // Optional success feedback
      }
    } catch (err) {
      setError(err.message || 'Update failed');
      console.error('Update error:', err);  // Debug: Catch error
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) return <div>Loading...</div>;
  if (!profile) return <div>{error || 'No profile found. Redirecting to login...'}</div>;

  return (
    <div>
      <h2>Student Dashboard</h2>
      <button onClick={handleLogout}>Logout</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <h3>Your Profile</h3>
      <p><strong>Name:</strong> {profile.name}</p>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Course:</strong> {profile.course}</p>
      <p><strong>Role:</strong> {profile.role} (Must be 'Student' for updates)</p> {/* Debug: Show role */}
      <p><strong>Enrollment Date:</strong> {new Date(profile.enrollmentDate).toLocaleDateString()}</p>
      <h3>Update Profile</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Course:</label>
          <input
            type="text"
            name="course"
            value={formData.course}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default StudentDashboard;
