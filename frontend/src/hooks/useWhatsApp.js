// frontend/src/hooks/useWhatsApp.js
export const useWhatsApp = () => {

    const enviarRecordatorio = (telefono, nombre, fechaVencimiento) => {
        if (!telefono) return alert("Este socio no tiene teléfono registrado");

        const mensaje = `Hola ${nombre}, te recordamos que tu cuota vence el ${fechaVencimiento}.`;

        // Codificamos el texto para que sea válido en una URL
        const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;

        // Abrimos en nueva pestaña
        window.open(url, '_blank');
    };

    return { enviarRecordatorio };
};