const tabla = document.getElementById("tabla");

function agregarFila(codigo) {
  const fila = document.createElement("tr");
  const fecha = new Date().toLocaleDateString();
  fila.innerHTML = `
    <td>${tabla.rows.length + 1}.</td>
    <td>${codigo}</td>
    <td>${fecha}</td>
  `;
  tabla.appendChild(fila);
}

function ingresoManual() {
  const codigo = prompt("Ingresa el código manualmente:");
  if (codigo) agregarFila(codigo);
}

function exportarCSV() {
  let csv = "#,Codigo,Fecha\n";
  for (let i = 0; i < tabla.rows.length; i++) {
    const cols = tabla.rows[i].children;
    csv += `${cols[0].innerText},${cols[1].innerText},${cols[2].innerText}\n`;
  }
  const blob = new Blob([csv], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "asistencia.csv";
  link.click();
}

// Escáner QR
function iniciarScanner() {
  const html5QrCode = new Html5Qrcode("reader");
  const config = { fps: 10, qrbox: 250 };

  html5QrCode.start(
    { facingMode: "environment" },
    config,
    qrCodeMessage => {
      agregarFila(qrCodeMessage);
      html5QrCode.stop(); // Detener después de un escaneo
    },
    errorMessage => {
      // console.log("Escaneo fallido", errorMessage);
    }
  );
}

window.onload = iniciarScanner;
