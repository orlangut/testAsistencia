const tabla = document.getElementById("tabla");
let datosEstudiantes = {}; // Diccionario de estudiantes

function agregarFila(codigo) {
  const fila = document.createElement("tr");
  const fecha = new Date().toLocaleDateString();
  const datos = datosEstudiantes[codigo];
  const nombreCompleto = datos ? `${datos.nombres} ${datos.apellidos}` : "No encontrado";

  fila.innerHTML = `
    <td>${tabla.rows.length + 1}.</td>
    <td>${codigo}</td>
    <td>${nombreCompleto}</td>
    <td>${fecha}</td>
  `;
  tabla.appendChild(fila);
}

function ingresoManual() {
  const codigo = prompt("Ingresa el código manualmente:");
  if (codigo) {
    agregarFila(codigo);

    // Reiniciar el escáner después de agregar manualmente
    setTimeout(() => {
      iniciarScanner();
    }, 500);
  }
}

function exportarCSV() {
  let csv = "#,Codigo,Nombre,Fecha\n";
  for (let i = 0; i < tabla.rows.length; i++) {
    const cols = tabla.rows[i].children;
    csv += `${cols[0].innerText},${cols[1].innerText},${cols[2].innerText},${cols[3].innerText}\n`;
  }
  const blob = new Blob([csv], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "asistencia.csv";
  link.click();
}

function iniciarScanner() {
  const html5QrCode = new Html5Qrcode("reader");
  const config = { fps: 10, qrbox: 250 };

  let ultimoCodigo = "";

  html5QrCode.start(
    { facingMode: "environment" },
    config,
    qrCodeMessage => {
      if (qrCodeMessage !== ultimoCodigo) {
        ultimoCodigo = qrCodeMessage;
        mostrarCheck();
        agregarFila(qrCodeMessage);

        setTimeout(() => {
          ultimoCodigo = "";
        }, 2000);
      }
    },
    errorMessage => {
      // Puedes manejar errores aquí si quieres
    }
  ).catch(err => {
    alert("Error al iniciar la cámara: " + err);
  });
}

function mostrarCheck() {
  const check = document.getElementById("check");
  check.style.display = "block";
  setTimeout(() => {
    check.style.display = "none";
  }, 1500);
}

// Cargar CSV desde input file
function cargarCSV(event) {
  const archivo = event.target.files[0];
  const lector = new FileReader();

  lector.onload = function(e) {
    const lineas = e.target.result.split("\n");
    datosEstudiantes = {}; // limpiar y recargar

    lineas.forEach((linea, index) => {
      if (index === 0) return;
      const columnas = linea.split(",");
      const id = columnas[0]?.trim();
      if (id) {
        datosEstudiantes[id] = {
          nombres: columnas[1]?.trim(),
          apellidos: columnas[2]?.trim(),
          facultad: columnas[3]?.trim(),
          carrera: columnas[4]?.trim(),
          email: columnas[5]?.trim()
        };
      }
    });

    alert("Archivo cargado correctamente.");

    // Por si se detuvo el escáner, vuelve a iniciarlo:
    setTimeout(() => {
      iniciarScanner();
    }, 500);
  };

  lector.readAsText(archivo);
}

// Advertir al usuario antes de recargar la página
window.addEventListener("beforeunload", (event) => {
  const mensaje = "¿Estás seguro de que deseas salir? Los datos no guardados se perderán.";
  event.preventDefault();
  event.returnValue = mensaje; // Aunque está deprecado, algunos navegadores lo requieren
  return mensaje; // Para navegadores modernos
});

window.onload = iniciarScanner;
