// import { useNavigate, Link } from 'react-router-dom';

// const Navbar = () => {
//   const navigate = useNavigate();
//   const token = localStorage.getItem('token');
//   const role = localStorage.getItem('role');

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('role');
//     navigate('/login');
//   };

//   return (
//     <nav style={{ padding: '10px', background: '#f0f0f0', marginBottom: '20px' }}>
//       <Link to="/" style={{ marginRight: '10px' }}>Home</Link>
//       {!token ? (
//         <>
//           <Link to="/login" style={{ marginRight: '10px' }}>Login</Link>
//           <Link to="/signup">Sign Up</Link>
//         </>
//       ) : (
//         <>
//           {role === 'Admin' && <Link to="/admin" style={{ marginRight: '10px' }}>Admin Dashboard</Link>}
//           {role === 'Student' && <Link to="/student" style={{ marginRight: '10px' }}>Student Dashboard</Link>}
//           <button onClick={handleLogout}>Logout</button>
//         </>
//       )}
//     </nav>
//   );
// };

// export default Navbar;


import { useNavigate, Link } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  console.log('Navbar debug:', { token: !!token, role });  // Debug log

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <nav style={{ padding: '10px', background: '#f0f0f0', marginBottom: '20px' }}>
      <Link to="/" style={{ marginRight: '10px' }}>Home</Link>
      {!token ? (
        <>
          <Link to="/login" style={{ marginRight: '10px' }}>Login</Link>
          <Link to="/signup">Sign Up</Link>
        </>
      ) : (
        <>
          {role === 'Admin' && <Link to="/admin" style={{ marginRight: '10px' }}>Admin Dashboard</Link>}
          {role === 'Student' && <Link to="/student" style={{ marginRight: '10px' }}>Student Dashboard</Link>}
          <button onClick={handleLogout}>Logout</button>
        </>
      )}
    </nav>
  );
};

export default Navbar;