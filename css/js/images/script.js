
"use strict";

/*
 * MERWIN SPORT
 * Autor: Merwin Arciniegas Remolina
 * Proyecto final del módulo 7.
 */

document.addEventListener("DOMContentLoaded", function () {
    // Muestra automáticamente el año actual en el pie de página.
    document.querySelectorAll("[data-anio-actual]").forEach(function (elemento) {
        elemento.textContent = new Date().getFullYear();
    });

    // Efectos visuales para las tarjetas de productos.
    document.querySelectorAll(".tarjeta-producto").forEach(function (tarjeta) {
        tarjeta.addEventListener("mouseenter", function () {
            tarjeta.classList.add("destacada");
        });

        tarjeta.addEventListener("mouseleave", function () {
            tarjeta.classList.remove("destacada");
        });
    });

    // Botones que muestran detalles de los productos.
    document.querySelectorAll("[data-ver-detalle]").forEach(function (boton) {
        boton.addEventListener("click", function () {
            const nombre = boton.dataset.nombre || "Producto deportivo";
            const detalle = boton.dataset.detalle ||
                "Consulta las características de este producto.";

            mostrarAviso(nombre + ": " + detalle);
        });
    });

    // Carrito demostrativo compartido entre las páginas durante la sesión.
    let carrito = [];

    try {
        const guardado = sessionStorage.getItem("merwinSportCarrito");
        carrito = guardado ? JSON.parse(guardado) : [];
        if (!Array.isArray(carrito)) {
            carrito = [];
        }
    } catch (error) {
        carrito = [];
    }

    actualizarContadorCarrito(carrito);

    // Agrega productos al carrito.
    document.querySelectorAll("[data-agregar-carrito]").forEach(function (boton) {
        boton.addEventListener("click", function () {
            const nombre = boton.dataset.nombre || "Producto deportivo";
            const precio = Number(boton.dataset.precio);

            if (!Number.isFinite(precio) || precio < 0) {
                mostrarAviso("No se pudo agregar el producto. Verifica su precio.");
                return;
            }

            carrito.push({
                nombre: nombre,
                precio: precio
            });

            try {
                sessionStorage.setItem(
                    "merwinSportCarrito",
                    JSON.stringify(carrito)
                );
            } catch (error) {
                // El carrito seguirá funcionando temporalmente en esta página.
            }

            actualizarContadorCarrito(carrito);
            mostrarAviso(nombre + " se agregó al carrito.");
        });
    });

    // Muestra los productos del carrito si existe su contenedor.
    const listaCarrito = document.getElementById("listaCarrito");
    const totalCarrito = document.getElementById("totalCarrito");

    if (listaCarrito && totalCarrito) {
        dibujarCarrito(carrito, listaCarrito, totalCarrito);

        const vaciarCarrito = document.getElementById("vaciarCarrito");

        if (vaciarCarrito) {
            vaciarCarrito.addEventListener("click", function () {
                carrito = [];

                try {
                    sessionStorage.removeItem("merwinSportCarrito");
                } catch (error) {
                    // El carrito queda vacío en la página actual.
                }

                actualizarContadorCarrito(carrito);
                dibujarCarrito(carrito, listaCarrito, totalCarrito);
                mostrarAviso("El carrito está vacío.");
            });
        }
    }

    // Validación demostrativa del formulario de contacto.
    const formularioContacto = document.getElementById("formularioContacto");

    if (formularioContacto) {
        formularioContacto.addEventListener("submit", function (evento) {
            evento.preventDefault();

            if (!formularioContacto.checkValidity()) {
                formularioContacto.reportValidity();
                return;
            }

            const resultado = document.getElementById("resultadoContacto");

            if (resultado) {
                resultado.textContent =
                    "Formulario validado correctamente. Esta demostración no envía datos a un servidor.";
                resultado.className = "alert alert-success mt-3";
            }

            formularioContacto.reset();
        });
    }
});

// Actualiza el número de artículos que se muestra en la navegación.
function actualizarContadorCarrito(carrito) {
    document.querySelectorAll("[data-contador-carrito]").forEach(function (elemento) {
        elemento.textContent = carrito.length;
    });
}

// Construye la lista del carrito usando nodos de texto seguros.
function dibujarCarrito(carrito, contenedor, totalElemento) {
    contenedor.replaceChildren();

    if (carrito.length === 0) {
        const mensaje = document.createElement("p");
        mensaje.textContent = "Tu carrito está vacío.";
        contenedor.appendChild(mensaje);
    } else {
        carrito.forEach(function (producto) {
            const fila = document.createElement("div");
            fila.className =
                "d-flex justify-content-between gap-3 border-bottom py-2";

            const nombre = document.createElement("span");
            nombre.textContent = producto.nombre;

            const precio = document.createElement("span");
            precio.textContent = formatearPrecio(producto.precio);

            fila.append(nombre, precio);
            contenedor.appendChild(fila);
        });
    }

    const total = carrito.reduce(function (suma, producto) {
        return suma + producto.precio;
    }, 0);

    totalElemento.textContent = formatearPrecio(total);
}

// Formatea los precios en pesos colombianos.
function formatearPrecio(valor) {
    return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0
    }).format(valor);
}

// Muestra mensajes visibles sin utilizar ventanas emergentes.
function mostrarAviso(texto) {
    let aviso = document.getElementById("avisoMerwinSport");

    if (!aviso) {
        aviso = document.createElement("div");
        aviso.id = "avisoMerwinSport";
        aviso.className = "alert alert-info mt-3";
        aviso.setAttribute("role", "status");

        const principal = document.querySelector("main");

        if (principal) {
            principal.prepend(aviso);
        } else {
            document.body.prepend(aviso);
        }
    }

    aviso.textContent = texto;
}
