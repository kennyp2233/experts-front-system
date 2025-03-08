'use client';
import { register } from "@/api/usuarios/auth.api";
import { useState } from "react";
import { dispatchMenssage } from "@/utils/menssageDispatcher";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../../providers/authProvider";
import {
    FaUser,
    FaEnvelope,
    FaLock,
    FaIdCard,
    FaBuilding,
    FaPhoneAlt,
    FaUserTag,
    FaTractor,
    FaBriefcase,
    FaHistory,
    FaMapMarkerAlt,
    FaArrowLeft,
    FaArrowRight,
    FaCheckCircle
} from 'react-icons/fa';

export default function Register() {
    const router = useRouter();
    const { isLoggedIn } = useAuth();

    // Estado para el paso actual
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 3;

    // Estado para el formulario
    const [formData, setFormData] = useState({
        usuario: '',
        email: '',
        password: '',
        confirmPassword: '',
        nombre: '',
        empresa: '',
        telefono: '',
        selectedRole: 'cliente',
        codigoFinca: '',
        direccionFinca: '',
        clientePrevio: false
    });

    const [errors, setErrors] = useState({
        usuario: '',
        email: '',
        password: '',
        confirmPassword: '',
        empresa: '',
        codigoFinca: '',
        direccionFinca: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Actualizar cualquier campo del formulario
    const updateFormData = (field: string, value: any) => {
        setFormData({
            ...formData,
            [field]: value
        });

        // Limpiar error cuando el usuario corrige el campo
        if (errors[field as keyof typeof errors]) {
            setErrors({
                ...errors,
                [field]: ''
            });
        }
    };

    // Validar el paso actual
    const validateStep = (step: number) => {
        let isValid = true;
        const newErrors = { ...errors };

        if (step === 1) {
            // Validar tipo de usuario y datos personales básicos
            if (!formData.usuario.trim()) {
                newErrors.usuario = 'Nombre de usuario es requerido';
                isValid = false;
            }

            if (!formData.email.trim()) {
                newErrors.email = 'Email es requerido';
                isValid = false;
            } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
                newErrors.email = 'Email no válido';
                isValid = false;
            }

            if (!formData.nombre.trim()) {
                isValid = false;
                dispatchMenssage('error', 'Nombre completo es requerido');
            }

            if (!formData.telefono.trim()) {
                isValid = false;
                dispatchMenssage('error', 'Teléfono es requerido');
            }
        }
        else if (step === 2) {
            // Validación para el segundo paso - información específica según tipo
            if (!formData.empresa.trim()) {
                newErrors.empresa = 'Este campo es requerido';
                isValid = false;
            }

            // Solo validar campos de finca si es rol finca y no es cliente previo
            if (formData.selectedRole === 'finca' && !formData.clientePrevio) {
                if (!formData.codigoFinca.trim()) {
                    newErrors.codigoFinca = 'Código de finca es requerido';
                    isValid = false;
                }

                if (!formData.direccionFinca.trim()) {
                    newErrors.direccionFinca = 'Dirección de finca es requerida';
                    isValid = false;
                }
            }
        }
        else if (step === 3) {
            // Validación para el tercer paso - contraseñas
            if (!formData.password) {
                newErrors.password = 'Contraseña es requerida';
                isValid = false;
            } else if (formData.password.length < 8) {
                newErrors.password = 'Contraseña debe tener al menos 8 caracteres';
                isValid = false;
            }

            if (!formData.confirmPassword) {
                newErrors.confirmPassword = 'Confirmar contraseña es requerido';
                isValid = false;
            } else if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = 'Las contraseñas no coinciden';
                isValid = false;
            }
        }

        setErrors(newErrors);
        return isValid;
    };

    // Ir al paso siguiente
    const goToNextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prevStep => Math.min(prevStep + 1, totalSteps));
        }
    };

    // Ir al paso anterior
    const goToPrevStep = () => {
        setCurrentStep(prevStep => Math.max(prevStep - 1, 1));
    };

    // Enviar el formulario
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateStep(currentStep)) return;

        setIsSubmitting(true);

        try {
            // Preparar datos adicionales para finca si aplica
            const additionalData = formData.selectedRole === 'finca' && !formData.clientePrevio
                ? { codigoFinca: formData.codigoFinca, direccionFinca: formData.direccionFinca, clientePrevio: formData.clientePrevio }
                : {};

            // Llamada a la API de registro
            const res = await register(
                formData.usuario,
                formData.email,
                formData.password,
                formData.nombre,
                formData.empresa,
                formData.telefono,
                formData.selectedRole,
                additionalData
            );

            if (res.ok) {
                dispatchMenssage('success', 'Usuario registrado correctamente. Su cuenta está pendiente de aprobación.');
                router.push('/sistema/initial/login');
            } else {
                dispatchMenssage('error', res.msg || 'Error al registrar usuario');
            }
        } catch (error) {
            dispatchMenssage('error', 'Error en el servidor. Intente más tarde.');
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoggedIn) {
        router.push('/sistema/dashboard');
        return null;
    }

    // Renderizar el paso actual
    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <>
                        <h2 className="text-xl font-semibold mb-4">Información básica</h2>

                        {/* Selección de tipo de usuario */}
                        <div className="form-control mb-4">
                            <label className="label">
                                <span className="label-text flex items-center font-medium">
                                    <FaUserTag className="mr-2" />
                                    Tipo de Usuario
                                </span>
                            </label>
                            <div className="flex gap-4">
                                <label className="cursor-pointer flex items-center border rounded-lg p-3 hover:bg-base-200 transition-colors duration-200 flex-1 justify-center">
                                    <input
                                        type="radio"
                                        className="radio radio-primary mr-2"
                                        checked={formData.selectedRole === 'cliente'}
                                        onChange={() => updateFormData('selectedRole', 'cliente')}
                                    />
                                    <span className="flex items-center">
                                        <FaBriefcase className="mr-2" /> Cliente
                                    </span>
                                </label>
                                <label className="cursor-pointer flex items-center border rounded-lg p-3 hover:bg-base-200 transition-colors duration-200 flex-1 justify-center">
                                    <input
                                        type="radio"
                                        className="radio radio-primary mr-2"
                                        checked={formData.selectedRole === 'finca'}
                                        onChange={() => updateFormData('selectedRole', 'finca')}
                                    />
                                    <span className="flex items-center">
                                        <FaTractor className="mr-2" /> Finca
                                    </span>
                                </label>
                            </div>
                        </div>

                        {/* Datos personales */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text flex items-center">
                                    <FaUser className="mr-2" />
                                    Nombre de Usuario
                                </span>
                            </label>
                            <input
                                type="text"
                                value={formData.usuario}
                                onChange={(e) => updateFormData('usuario', e.target.value)}
                                placeholder="Ejemplo: JuanPerez123"
                                className={`input input-bordered ${errors.usuario ? 'input-error' : ''}`}
                            />
                            {errors.usuario && <p className="text-error text-sm mt-1">{errors.usuario}</p>}
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text flex items-center">
                                    <FaIdCard className="mr-2" />
                                    Nombre Completo
                                </span>
                            </label>
                            <input
                                type="text"
                                value={formData.nombre}
                                onChange={(e) => updateFormData('nombre', e.target.value)}
                                placeholder="Juan Pérez"
                                className="input input-bordered"
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text flex items-center">
                                    <FaEnvelope className="mr-2" />
                                    Email
                                </span>
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => updateFormData('email', e.target.value)}
                                placeholder="Email"
                                className={`input input-bordered ${errors.email ? 'input-error' : ''}`}
                            />
                            {errors.email && <p className="text-error text-sm mt-1">{errors.email}</p>}
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text flex items-center">
                                    <FaPhoneAlt className="mr-2" />
                                    Teléfono
                                </span>
                            </label>
                            <input
                                type="tel"
                                value={formData.telefono}
                                onChange={(e) => updateFormData('telefono', e.target.value)}
                                placeholder="+593 9999 9999"
                                className="input input-bordered"
                            />
                        </div>
                    </>
                );

            case 2:
                return (
                    <>
                        <h2 className="text-xl font-semibold mb-4">
                            {formData.selectedRole === 'finca' ? 'Información de la Finca' : 'Información de la Empresa'}
                        </h2>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text flex items-center">
                                    <FaBuilding className="mr-2" />
                                    {formData.selectedRole === 'finca' ? 'Nombre de la Finca' : 'Empresa/Organización'}
                                </span>
                            </label>
                            <input
                                type="text"
                                value={formData.empresa}
                                onChange={(e) => updateFormData('empresa', e.target.value)}
                                placeholder={formData.selectedRole === 'finca' ? "Nombre de la finca" : "Nombre de su empresa"}
                                className={`input input-bordered ${errors.empresa ? 'input-error' : ''}`}
                            />
                            {errors.empresa && <p className="text-error text-sm mt-1">{errors.empresa}</p>}
                        </div>

                        {/* Campos específicos para finca */}
                        {formData.selectedRole === 'finca' && (
                            <>
                                <div className="form-control mt-4">
                                    <label className="label cursor-pointer justify-start">
                                        <input
                                            type="checkbox"
                                            className="toggle toggle-primary mr-3"
                                            checked={formData.clientePrevio}
                                            onChange={(e) => updateFormData('clientePrevio', e.target.checked)}
                                        />
                                        <span className="label-text flex items-center">
                                            <FaHistory className="mr-2" />
                                            Ya he trabajado con ExpertGuide anteriormente
                                        </span>
                                    </label>
                                    {formData.clientePrevio && (
                                        <div className="mt-2 text-sm text-info bg-info/10 p-3 rounded-lg">
                                            Si ya ha trabajado con nosotros, es posible que ya tengamos sus datos.
                                            Nuestro equipo verificará su información durante el proceso de aprobación.
                                        </div>
                                    )}
                                </div>

                                {!formData.clientePrevio && (
                                    <>
                                        <div className="form-control mt-4">
                                            <label className="label">
                                                <span className="label-text flex items-center">
                                                    <FaIdCard className="mr-2" />
                                                    Código de Finca
                                                </span>
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.codigoFinca}
                                                onChange={(e) => updateFormData('codigoFinca', e.target.value)}
                                                placeholder="Código identificador de la finca"
                                                className={`input input-bordered ${errors.codigoFinca ? 'input-error' : ''}`}
                                            />
                                            {errors.codigoFinca && <p className="text-error text-sm mt-1">{errors.codigoFinca}</p>}
                                        </div>

                                        <div className="form-control mt-4">
                                            <label className="label">
                                                <span className="label-text flex items-center">
                                                    <FaMapMarkerAlt className="mr-2" />
                                                    Dirección de la Finca
                                                </span>
                                            </label>
                                            <textarea
                                                value={formData.direccionFinca}
                                                onChange={(e) => updateFormData('direccionFinca', e.target.value)}
                                                placeholder="Dirección completa de la finca"
                                                className={`textarea textarea-bordered ${errors.direccionFinca ? 'textarea-error' : ''}`}
                                                rows={3}
                                            />
                                            {errors.direccionFinca && <p className="text-error text-sm mt-1">{errors.direccionFinca}</p>}
                                        </div>
                                    </>
                                )}
                            </>
                        )}
                    </>
                );

            case 3:
                return (
                    <>
                        <h2 className="text-xl font-semibold mb-4">Configuración de cuenta</h2>
                        <p className="text-sm text-base-content/70 mb-4">
                            Establezca una contraseña segura para proteger su cuenta.
                        </p>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text flex items-center">
                                    <FaLock className="mr-2" />
                                    Contraseña
                                </span>
                            </label>
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => updateFormData('password', e.target.value)}
                                placeholder="Mínimo 8 caracteres"
                                className={`input input-bordered ${errors.password ? 'input-error' : ''}`}
                            />
                            {errors.password && <p className="text-error text-sm mt-1">{errors.password}</p>}
                        </div>

                        <div className="form-control mt-4">
                            <label className="label">
                                <span className="label-text flex items-center">
                                    <FaLock className="mr-2" />
                                    Confirmar Contraseña
                                </span>
                            </label>
                            <input
                                type="password"
                                value={formData.confirmPassword}
                                onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                                placeholder="Confirmar Contraseña"
                                className={`input input-bordered ${errors.confirmPassword ? 'input-error' : ''}`}
                            />
                            {errors.confirmPassword && <p className="text-error text-sm mt-1">{errors.confirmPassword}</p>}
                        </div>

                        <div className="bg-base-200 rounded-lg p-4 mt-6">
                            <h3 className="font-medium mb-2">Resumen de registro</h3>
                            <ul className="space-y-1 text-sm">
                                <li><strong>Usuario:</strong> {formData.usuario}</li>
                                <li><strong>Nombre:</strong> {formData.nombre}</li>
                                <li><strong>Email:</strong> {formData.email}</li>
                                <li><strong>Teléfono:</strong> {formData.telefono}</li>
                                <li><strong>Tipo:</strong> {formData.selectedRole === 'cliente' ? 'Cliente' : 'Finca'}</li>
                                <li><strong>{formData.selectedRole === 'cliente' ? 'Empresa' : 'Finca'}:</strong> {formData.empresa}</li>
                                {formData.selectedRole === 'finca' && !formData.clientePrevio && (
                                    <>
                                        <li><strong>Código Finca:</strong> {formData.codigoFinca}</li>
                                        <li><strong>Dirección Finca:</strong> {formData.direccionFinca}</li>
                                    </>
                                )}
                            </ul>
                        </div>
                    </>
                );

            default:
                return null;
        }
    };

    return (
        <div className="hero min-h-screen bg-base-200">
            <button className="m-6 z-10 btn btn-neutral self-start place-self-start" onClick={() => router.push('/sistema/initial/login')}>
                <FaArrowLeft className="mr-2" />
                Login
            </button>

            <div className="hero-content flex-col lg:flex-row-reverse w-full max-w-5xl px-4 mt-24">
                <div className="text-center lg:text-left lg:ml-10 lg:max-w-sm">
                    <h1 className="text-3xl font-bold">Crea tu cuenta</h1>
                    <p className="py-6">
                        Al registrarte en ExpertGuide, tendrás acceso a nuestro sistema de gestión de exportaciones
                        y podrás realizar seguimiento a tus envíos.
                    </p>

                    <div className="hidden lg:block">
                        <div className="mt-8 relative">
                            {formData.selectedRole === 'cliente' ? (
                                <div className="card bg-base-100 shadow-md p-4">
                                    <h3 className="font-bold flex items-center"><FaBriefcase className="mr-2" /> Cliente</h3>
                                    <p className="text-sm mt-2">
                                        Regístrate como cliente para gestionar tus envíos, hacer seguimiento a tus productos
                                        y coordinar con nuestro equipo.
                                    </p>
                                </div>
                            ) : (
                                <div className="card bg-base-100 shadow-md p-4">
                                    <h3 className="font-bold flex items-center"><FaTractor className="mr-2" /> Finca</h3>
                                    <p className="text-sm mt-2">
                                        Regístrate como finca para conectar con nuestro sistema de gestión, recibir notificaciones
                                        de pedidos y coordinar envíos.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="card flex-shrink-0 w-full max-w-md shadow-2xl bg-base-100">
                    <div className="card-body">
                        <ul className="steps steps-vertical lg:steps-horizontal mb-6">
                            <li className={`step ${currentStep >= 1 ? 'step-primary' : ''}`}>Datos Básicos</li>
                            <li className={`step ${currentStep >= 2 ? 'step-primary' : ''}`}>{formData.selectedRole === 'finca' ? 'Datos de Finca' : 'Datos de Empresa'}</li>
                            <li className={`step ${currentStep >= 3 ? 'step-primary' : ''}`}>Configuración</li>
                        </ul>

                        <form onSubmit={handleSubmit}>
                            <div className="min-h-64">
                                {renderStep()}
                            </div>

                            <div className="flex justify-between mt-6">
                                {currentStep > 1 && (
                                    <button
                                        type="button"
                                        className="btn btn-outline"
                                        onClick={goToPrevStep}
                                    >
                                        <FaArrowLeft className="mr-2" /> Anterior
                                    </button>
                                )}

                                <div className="flex-1"></div>

                                {currentStep < totalSteps ? (
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={goToNextStep}
                                    >
                                        Siguiente <FaArrowRight className="ml-2" />
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <span className="loading loading-spinner loading-xs"></span>
                                                Procesando...
                                            </>
                                        ) : (
                                            <>
                                                Registrarse <FaCheckCircle className="ml-2" />
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}