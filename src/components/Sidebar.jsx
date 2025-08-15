import React, { useState, useEffect, useRef } from 'react'

// icons
import { IoCloseCircleSharp } from "react-icons/io5";
import { VscAccount } from "react-icons/vsc";
import { MdMenuOpen } from "react-icons/md";
import { IoHomeOutline } from "react-icons/io5";
import { FaProductHunt } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";
import { TbReportSearch } from "react-icons/tb";
import { IoLogoBuffer } from "react-icons/io";
import { CiSettings } from "react-icons/ci";
import { MdOutlineDashboard } from "react-icons/md";
import Signup from './Signup';
import Login from './Login';
import PerfilUsuario from './PerfilUsuario';
import NuevoActivo from './Activos/NuevoActivo';

const menuItems = [
  {
    icons: <IoHomeOutline size={30} />,
    label: 'Home'
  },
  {
    icons: <FaProductHunt size={30} />,
    label: 'Activos'
  },
  {
    icons: <MdOutlineDashboard size={30} />,
    label: 'Amenazas'
  },
  {
    icons: <CiSettings size={30} />,
    label: 'Analisis Riesgo'
  },
  {
    icons: <IoLogoBuffer size={30} />,
    label: 'Tratamiento'
  },
  {
    icons: <TbReportSearch size={30} />,
    label: 'Controles'
  }
]

export default function Sidebar({ activeArea, setActiveArea, user, setUser }) {
  const [open, setOpen] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showPerfil, setShowPerfil] = useState(false);
  const [showNuevo, setShowNuevo] = useState(false);
  const menuRef = useRef();

  // Función para cuando el login es exitoso
  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setShowLogin(false); // Esto cierra el modal de Login al iniciar sesión
  };

  // Función para cuando el registro es exitoso
  const handleSignupSuccess = (userData) => {
    setUser(userData);
    setShowSignup(false);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    }
    if (showUserMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showUserMenu]);

  return (
    <nav className={`shadow-md h-screen flex flex-col duration-500 bg-blue-400 text-white ${open ? 'w-49' : 'w-16'}`}>

      {/* Header */}
      <div className='px-3 py-2 h-20 flex justify-between items-center transition-all duration-500 ease-in-out'>
        <img
          src="/logo.png"
          alt="Logo"
          className={`
            rounded-md
            transition-all duration-500 ease-in-out
            ${open ? 'w-20 opacity-100' : 'w-0 opacity-0'}
          `}
          style={{ transitionProperty: 'width, opacity' }}
        />
        <div>
          <MdMenuOpen
            size={34}
            className={`
              transition-all duration-500 ease-in-out cursor-pointer
              ${!open ? 'rotate-180' : ''}
            `}
            onClick={() => setOpen(!open)}
          />
        </div>
      </div>

      {/* Body */}

      <ul className='flex-1'>
        {
          menuItems.map((item, index) => {
            return (
              <li
                key={index}
                className={`
                  px-3 py-2 my-2 min-h-[58px] hover:bg-blue-800 rounded-md duration-300 cursor-pointer
                  flex gap-2 items-center relative group
                  ${activeArea === item.label ? 'bg-blue-800' : ''}
                `}
                onClick={() => setActiveArea(item.label)}
              >
                <div className="flex items-center justify-center w-8 h-8">
                  {/* Fuerza el tamaño del icono */}
                  {React.cloneElement(item.icons, { size: 28 })}
                </div>
                <p className={`${!open && 'w-0 translate-x-24'} duration-500 overflow-hidden`}>{item.label}</p>
                <p
                  className={`
                    ${open && 'hidden'}
                    absolute left-32 shadow-md rounded-md
                    w-0 p-0 text-black bg-white duration-100 overflow-hidden
                    group-hover:min-w-max group-hover:w-auto group-hover:p-2 group-hover:left-16
                  `}
                >
                  {item.label}
                </p>
              </li>
            )
          })
        }
      </ul>
      {/* footer */}
      <div className='flex items-center gap-2 px-3 py-2'>
        <div>
          <FaUserCircle
            size={user ? 30 : 40}
            className={`cursor-pointer transition-all duration-300
              ${!user && 'text-white hover:text-blue-900 hover:scale-110'}
              ${user && 'hover:text-blue-900'}
            `}
            onClick={() => {
              if (user) {
                setShowUserMenu((prev) => !prev);
              } else {
                setShowLogin(true);
              }
            }}
            title={!user ? "Iniciar sesión" : ""}
          />
        </div>
        {user ? (
          <div className={`leading-5 ${!open && 'w-0 translate-x-24'} duration-500 overflow-hidden`}>
            <p className="font-bold">{user.nombre_empresa}</p>
            <p>{user.email}</p>
          </div>
        ) : (
          <span
            className={`text-md font-semibold text-white transition-colors duration-300
              ${open ? 'opacity-100' : 'opacity-0'}
            `}
          >
            Iniciar sesión
          </span>
        )}
      </div>
      {showLogin && (
        <Login
          onClose={() => setShowLogin(false)}
          onSignup={() => { setShowLogin(false); setShowSignup(true); }}
          onLoginSuccess={setUser}
        />
      )}
      {showSignup && (
        <Signup
          onClose={() => setShowSignup(false)}
          onSignupSuccess={handleSignupSuccess}
          onLogin={() => { setShowSignup(false); setShowLogin(true); }} // <-- agrega esto
        />
      )}
      {user && showUserMenu && (
        <div ref={menuRef} className="absolute bottom-16 left-4 bg-zinc-900 text-white rounded shadow-lg w-48 z-50">
          <div className="p-3 border-b border-zinc-700 font-semibold">Mi Cuenta</div>
          <button
            className="flex items-center gap-2 w-full px-3 py-2 hover:bg-zinc-800 text-left"
            onClick={() => {
              setShowPerfil(true);
              setShowUserMenu(false);
            }}>
            <span><VscAccount size={20} /></span> Perfil
          </button>
          <button className="flex items-center gap-2 w-full px-3 py-4 hover:bg-zinc-800 text-left text-white"
            onClick={() => {
              setUser(null);
              setShowUserMenu(false);
            }}>
            <span><IoCloseCircleSharp size={20} /></span> Cerrar Sesión
          </button>
        </div>
      )}
      {showPerfil && (
        <PerfilUsuario user={user} onClose={() => setShowPerfil(false)} />
      )}
      {showNuevo && (
        <NuevoActivo
          open={showNuevo}
          onClose={() => setShowNuevo(false)}
          onSave={(nuevoActivo) => {
            // Lógica para guardar el nuevo activo
            console.log('Nuevo Activo:', nuevoActivo);
            setShowNuevo(false);
          }}
          user={user} // Pasa el usuario a NuevoActivo
        />
      )}
    </nav>
  );
}