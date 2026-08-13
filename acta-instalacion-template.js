function generarContenidoActaInstalacion(data) {

    const v = x => (x && String(x).trim()) ? String(x).trim() : '';

    const fmtFecha = iso => {
        if (!iso) return '';
        const [y, m, d] = iso.split('-');
        return `${d}/${m}/${y}`;
    };

    const sino = valor => {
        if (valor === 'si') return '<b style="color:#111;">Sí</b>';
        if (valor === 'no') return '<b style="color:#111;">No</b>';
        return '';
    };

    const HP  = '#5a5a5a';
    const HPb = '#3d3d3d';

    const tbl  = 'width:100%;border-collapse:collapse;font-size:11.5px;';
    const thS  = `padding:5px 8px;background:${HP};color:#fff;font-weight:700;font-size:11px;border:1px solid ${HPb};text-align:center;`;
    const thSL = `padding:5px 8px;background:${HP};color:#fff;font-weight:700;font-size:11px;border:1px solid ${HPb};text-align:left;`;
    const thSG = `padding:5px 8px;background:${HP};color:#fff;font-weight:700;font-size:11px;border:1px solid ${HPb};text-align:center;width:44px;`;
    const lbl  = 'padding:5px 8px;background:#f5f8fa;font-size:10.5px;color:#444;border:1px solid #cccccc;white-space:nowrap;width:1%;vertical-align:top;';
    const val  = 'padding:5px 8px;background:#fff;font-size:11px;color:#222;border:1px solid #cccccc;vertical-align:top;';
    const valC = val + 'text-align:center;width:44px;';

    const hpLogo = `<img src="img/2048px-HP_logo_2012.svg.png" style="width:54px;height:54px;display:block;object-fit:contain;">`;

    const buildRows = items => items.map(item => {
        if (item.tipo === 'text') {
            return `<tr>
                <td style="${val}">${item.label}</td>
                <td style="${val}" colspan="2">${v(item.valor)}</td>
            </tr>`;
        }
        return `<tr>
            <td style="${val}">${item.label}</td>
            <td style="${valC}">${item.valor === 'si' ? sino('si') : ''}</td>
            <td style="${valC}">${item.valor === 'no' ? sino('no') : ''}</td>
        </tr>`;
    }).join('');

    const firmaBlock = (titulo, nombre, rut, img) => {
        const firmaImg = img
            ? `<img src="${img}" style="max-width:180px;max-height:66px;display:block;margin:0 auto 4px;">`
            : '<div style="height:56px;"></div>';
        return `<td style="vertical-align:top;border:1px solid #cccccc;padding:0;">
        <div style="background:${HP};color:#fff;font-weight:700;font-size:10.5px;padding:5px 8px;">${titulo}</div>
        <table style="${tbl}">
            <tr><td style="${lbl}">Nombre</td><td style="${val}">${v(nombre)}</td></tr>
            <tr><td style="${lbl}">Rut</td><td style="${val}">${v(rut)}</td></tr>
        </table>
        <div style="padding:6px 8px;border-top:1px solid #cccccc;text-align:center;min-height:72px;">
            ${firmaImg}
            <div style="font-size:9px;color:#999;border-top:1px solid #ccc;padding-top:3px;margin-top:2px;">Firma</div>
        </div>
        </td>`;
    };

    const tituloActa = 'Registro de Instalación';

    const obsBlock = v(data.observaciones)
        ? `<table style="${tbl}margin-bottom:7px;">
  <tr><th colspan="2" style="${thS}">Observaciones</th></tr>
  <tr><td style="${val}font-size:10.5px;line-height:1.5;" colspan="2">${v(data.observaciones)}</td></tr>
</table>`
        : '';

    return `
<div style="font-family:Arial,Helvetica,sans-serif;font-size:11.5px;color:#222;background:#fff;width:190mm;margin:0;padding:0;">

<!-- ENCABEZADO -->
<table style="width:100%;border-collapse:collapse;margin-bottom:8px;">
  <tr>
    <td style="width:64px;vertical-align:middle;padding-right:10px;">${hpLogo}</td>
    <td style="vertical-align:middle;">
      <div style="font-size:9.5px;color:#555;font-weight:600;line-height:1.5;">HP<br>Proyecto MINSAL 2026<br>Chile</div>
    </td>
    <td style="text-align:center;vertical-align:middle;">
      <div style="font-size:17px;font-weight:700;color:#111;line-height:1.1;">${tituloActa}</div>
    </td>
    <td style="text-align:right;vertical-align:middle;width:140px;">
      <div style="font-size:9px;color:#555;line-height:1.6;">Mesa de Ayuda HP / MINSAL<br>Control de inventario y ubicación</div>
    </td>
  </tr>
</table>
<hr style="border:none;border-top:2.5px solid ${HP};margin:0 0 8px;">

<!-- DATOS GENERALES -->
<table style="${tbl}margin-bottom:7px;">
  <tr><th colspan="4" style="${thS}">Datos Generales</th></tr>
  <tr>
    <td style="${lbl}">Organismo</td><td style="${val}" colspan="3">${v(data.organismo)}</td>
  </tr>
  <tr>
    <td style="${lbl}">Establecimiento</td><td style="${val}">${v(data.establecimiento)}</td>
    <td style="${lbl}">Fecha</td><td style="${val}">${fmtFecha(data.fecha)}</td>
  </tr>
  <tr>
    <td style="${lbl}">Dirección</td><td style="${val}">${v(data.direccion)}</td>
    <td style="${lbl}">Ciudad</td><td style="${val}">${v(data.ciudad)}</td>
  </tr>
  <tr>
    <td style="${lbl}">Unidad o Depto</td><td style="${val}">${v(data.unidad)}</td>
    <td style="${lbl}">Región</td><td style="${val}">${v(data.region)}</td>
  </tr>
  <tr>
    <td style="${lbl}">Responsable</td><td style="${val}">${v(data.nombre)}</td>
    <td style="${lbl}">Rut</td><td style="${val}">${v(data.rut)}</td>
  </tr>
  <tr>
    <td style="${lbl}">Email Usuario</td><td style="${val}">${v(data.email)}</td>
    <td style="${lbl}">Teléfono</td><td style="${val}">${v(data.telefono)}</td>
  </tr>
  <tr>
    <td style="${lbl}">Cargo Usuario</td><td style="${val}">${v(data.cargo)}</td>
    <td style="${lbl}">Serie computador</td><td style="${val}">${v(data.serie)}</td>
  </tr>
</table>

<!-- CHECKLISTS: Instalación (izq) | Usuario + Validación (der) -->
<table style="width:100%;border-collapse:collapse;margin-bottom:7px;">
  <tr>
    <td style="vertical-align:top;padding:0;width:52%;">
      <table style="${tbl}">
        <tr><th colspan="3" style="${thS}">Checklist Instalación</th></tr>
        <tr>
          <th style="${thSL}">Ítem de instalación</th>
          <th style="${thSG}">Sí</th>
          <th style="${thSG}">No</th>
        </tr>
        ${buildRows(data.checklistInstalacion || [])}
      </table>
    </td>
    <td style="width:8px;padding:0;border:none;"></td>
    <td style="vertical-align:top;padding:0;">
      <table style="${tbl}margin-bottom:6px;">
        <tr><th colspan="3" style="${thS}">Checklist Usuario</th></tr>
        <tr>
          <th style="${thSL}">Ítem de usuario</th>
          <th style="${thSG}">Sí</th>
          <th style="${thSG}">No</th>
        </tr>
        ${buildRows(data.checklistUsuario || [])}
      </table>
      <table style="${tbl}">
        <tr><th colspan="3" style="${thS}">Checklist Validación</th></tr>
        <tr>
          <th style="${thSL}">Ítem de validación</th>
          <th style="${thSG}">Sí</th>
          <th style="${thSG}">No</th>
        </tr>
        ${buildRows(data.checklistValidacion || [])}
      </table>
    </td>
  </tr>
</table>

${obsBlock}

<!-- ACEPTACIÓN CONFORME -->
<table style="${tbl}margin-bottom:7px;">
  <tr><th colspan="3" style="${thS}">Aceptación Conforme</th></tr>
  <tr>
    ${firmaBlock('Técnico Instalador HP', data.nombreTecnico, data.rutTecnico, data.firmaTecnico)}
    <td style="width:8px;padding:0;border:none;"></td>
    ${firmaBlock('Firmante del Documento', data.nombreFirmante, data.rutFirmante, data.firmaFirmante)}
  </tr>
</table>

<!-- PIE -->
<div style="text-align:center;font-size:9px;color:#aaa;border-top:1px solid #ddd;padding-top:5px;margin-top:2px;">
  Ministerio de Salud - Chile &nbsp;|&nbsp; Proyecto MINSAL 2026 &nbsp;|&nbsp; Mesa de Ayuda HP / MINSAL
</div>

</div>`;
}