document.addEventListener('DOMContentLoaded', () => {

    // ── Definición de checklists ──────────────────────────────────────────
    const CHECKLIST_INSTALACION = [
        { label: 'Desembalaje, revisión e instalación física del equipo' },
        { label: 'Instalación de PC y conexión de componentes básicos (mouse, teclado y torre)' },
        { label: 'Verificación de conexión adecuada a la toma de corriente' },
        { label: 'Instalación y configuración de periféricos adicionales (escáner, impresora, fax, etc.)' },
        { label: 'Configuración y conexión a red de datos' },
        { label: 'Configuración IP Equipo', tipo: 'text', id: 'ipEquipo' },
        { label: 'Instalación y personalización de aplicaciones desde el servidor de red' },
        { label: 'Definición y configuración del servicio de impresión' },
        { label: 'Migración de información del usuario desde su equipo antiguo' },
        { label: 'Conexión final del equipo a la red' },
        { label: 'Verificación de agente en línea con mesa de ayuda' },
        { label: 'Configuración de correo electrónico del usuario' },
        { label: 'Configuración de pie de firma en correo' },
    ];

    const CHECKLIST_USUARIO = [
        { label: 'Demostración de operación de hardware y software instalados' },
        { label: 'Instrucción para acceso al sistema de mesa de ayuda y soporte telefónico' },
    ];

    const CHECKLIST_VALIDACION = [
        { label: 'Número de identificación del equipo' },
        { label: 'Características de configuración' },
        { label: 'Detalle de diagnósticos realizados' },
        { label: 'Niveles de BIOS y firmware' },
        { label: 'Revisión del sistema operativo y software instalados' },
        { label: 'Modelos y números de serie de equipo y periféricos' },
        { label: 'Entrega formal del equipo con formulario de ingreso' },
        { label: 'Emisión de Guía de Despacho con números de serie de cada equipo por establecimiento' },
    ];

    // ── Construir tabla de checklist ──────────────────────────────────────
    function buildChecklistTable(tbodyId, items, namePrefix) {
        const tbody = document.getElementById(tbodyId);
        items.forEach((item, i) => {
            const tr = document.createElement('tr');
            if (item.tipo === 'text') {
                tr.innerHTML = `
                    <td colspan="3">
                        <div style="display:flex;align-items:center;gap:12px;">
                            <span style="white-space:nowrap;font-size:14px;">${item.label}</span>
                            <input type="text" id="${item.id}" class="ip-input" placeholder="Dirección IP del equipo">
                        </div>
                    </td>`;
            } else {
                tr.innerHTML = `
                    <td>${item.label}</td>
                    <td class="td-sino">
                        <label class="sino-radio si-label">
                            <input type="radio" name="${namePrefix}${i}" value="si"> Sí
                        </label>
                    </td>
                    <td class="td-sino">
                        <label class="sino-radio no-label">
                            <input type="radio" name="${namePrefix}${i}" value="no"> No
                        </label>
                    </td>`;
            }
            tbody.appendChild(tr);
        });

        // Permitir desmarcar al hacer clic de nuevo
        document.querySelectorAll(`#${tbodyId} input[type="radio"]`).forEach(radio => {
            radio.dataset.checked = 'false';
            radio.addEventListener('click', function () {
                if (this.dataset.checked === 'true') {
                    this.checked = false;
                    this.dataset.checked = 'false';
                } else {
                    document.querySelectorAll(`input[name="${this.name}"]`).forEach(r => {
                        r.dataset.checked = 'false';
                    });
                    this.dataset.checked = 'true';
                }
            });
        });
    }

    buildChecklistTable('tbodyInstalacion', CHECKLIST_INSTALACION, 'ci');
    buildChecklistTable('tbodyUsuario',     CHECKLIST_USUARIO,     'cu');
    buildChecklistTable('tbodyValidacion',  CHECKLIST_VALIDACION,  'cv');

    // ── Marcar / desmarcar todo como Sí (toggle) ─────────────────────────
    window.marcarTodoSi = function (tbodyId, btn) {
        const isActive = btn.dataset.active === 'true';

        if (isActive) {
            // Desmarcar todo
            document.querySelectorAll(`#${tbodyId} input[type="radio"]`).forEach(radio => {
                radio.checked = false;
                radio.dataset.checked = 'false';
            });
            btn.dataset.active = 'false';
            btn.classList.remove('marcar-si-btn--active');
            btn.innerHTML = '✓ Marcar todo como Sí';
        } else {
            // Marcar todo como Sí
            document.querySelectorAll(`#${tbodyId} input[type="radio"][value="si"]`).forEach(radio => {
                radio.checked = true;
                radio.dataset.checked = 'true';
                const noRadio = document.querySelector(`#${tbodyId} input[name="${radio.name}"][value="no"]`);
                if (noRadio) { noRadio.checked = false; noRadio.dataset.checked = 'false'; }
            });
            btn.dataset.active = 'true';
            btn.classList.add('marcar-si-btn--active');
            btn.innerHTML = '✓ Desmarcar todo';
        }
    };

    // ── Fecha: se deja vacía hasta que el usuario la complete ──────────────

    // ── Organismo ─────────────────────────────────────────────────────────
    const GRUPOS_ORG = [
        { label: 'MINSAL Central',     items: minsalCentral },
        { label: 'Servicios de Salud', items: serviciosSalud },
        { label: 'SEREMI de Salud',    items: seremisSalud },
    ];

    function poblarOrganismo(selectId) {
        const sel = document.getElementById(selectId);
        GRUPOS_ORG.forEach(({ label, items }) => {
            const grp = document.createElement('optgroup');
            grp.label = label;
            items.forEach(nombre => {
                const opt = document.createElement('option');
                opt.value = opt.textContent = nombre;
                grp.appendChild(opt);
            });
            sel.appendChild(grp);
        });
    }

    poblarOrganismo('organismo');

    // ── Regiones + Comunas ────────────────────────────────────────────────
    function cargarRegiones(selId) {
        const sel = document.getElementById(selId);
        Object.keys(regionesComunas).forEach(reg => {
            const opt = document.createElement('option');
            opt.value = opt.textContent = reg;
            sel.appendChild(opt);
        });
    }

    function bindComunas(regionId, ciudadId) {
        document.getElementById(regionId).addEventListener('change', function () {
            const sel = document.getElementById(ciudadId);
            sel.innerHTML = '<option value="">Seleccione Comuna</option>';
            (regionesComunas[this.value] || []).forEach(c => {
                const opt = document.createElement('option');
                opt.value = opt.textContent = c;
                sel.appendChild(opt);
            });
        });
    }

    cargarRegiones('region');
    bindComunas('region', 'ciudad');

    // ── Auto-región según organismo ───────────────────────────────────────
    document.getElementById('organismo').addEventListener('change', function () {
        const reg = organismoRegionMap[this.value];
        const regionSel = document.getElementById('region');
        if (reg && regionSel.querySelector(`option[value="${reg}"]`)) {
            regionSel.value = reg;
            regionSel.dispatchEvent(new Event('change'));
        }
    });

    // ── Signature Pad (factory) ───────────────────────────────────────────
    function createPad(canvasId, hiddenId, placeholderId, deleteBtnId) {
        const canvas = document.getElementById(canvasId);
        const ctx    = canvas.getContext('2d');
        const ph     = document.getElementById(placeholderId);
        const hidden = document.getElementById(hiddenId);
        const delBtn = deleteBtnId ? document.getElementById(deleteBtnId) : null;
        let drawing = false;
        let hasSig  = false;

        function resize() {
            const data = canvas.toDataURL();
            canvas.width  = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            ctx.strokeStyle = '#1e2d3d';
            ctx.lineWidth   = 2;
            ctx.lineCap = ctx.lineJoin = 'round';
            const img = new Image();
            img.onload = () => ctx.drawImage(img, 0, 0);
            img.src = data;
        }

        function pos(e) {
            const r   = canvas.getBoundingClientRect();
            const src = e.touches ? e.touches[0] : e;
            return {
                x: (src.clientX - r.left)  * (canvas.width  / r.width),
                y: (src.clientY - r.top)   * (canvas.height / r.height),
            };
        }

        canvas.addEventListener('mousedown',  start);
        canvas.addEventListener('mousemove',  move);
        canvas.addEventListener('mouseup',    end);
        canvas.addEventListener('mouseleave', end);
        canvas.addEventListener('touchstart', start, { passive: false });
        canvas.addEventListener('touchmove',  move,  { passive: false });
        canvas.addEventListener('touchend',   end);

        function start(e) {
            e.preventDefault();
            drawing = true;
            const p = pos(e);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ph.style.display = 'none';
        }
        function move(e) {
            e.preventDefault();
            if (!drawing) return;
            const p = pos(e);
            ctx.lineTo(p.x, p.y);
            ctx.stroke();
        }
        function end(e) {
            e.preventDefault();
            if (!drawing) return;
            drawing = false;
            hasSig = true;
            if (delBtn) delBtn.style.display = 'inline-flex';
        }

        requestAnimationFrame(resize);
        window.addEventListener('resize', resize);

        if (delBtn) delBtn.addEventListener('click', () => pad.clear());

        const pad = {
            hasSignature() { return hasSig; },
            capture()      { return hasSig ? canvas.toDataURL() : ''; },
            clear() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ph.style.display = 'flex';
                hasSig = false;
                hidden.value = '';
                if (delBtn) delBtn.style.display = 'none';
            },
        };
        return pad;
    }

    const padTecnico  = createPad('canvasTecnico',  'firmaTecnico',  'phTecnico',  'btnBorrarTecnico');
    const padFirmante = createPad('canvasFirmante', 'firmaFirmante', 'phFirmante', 'btnBorrarFirmante');

    // ── Autocomplete unidad ───────────────────────────────────────────────
    activarAutocompleteUnidad('unidad');

    // ── Validaciones ──────────────────────────────────────────────────────
    activarValidacionRut('rut',           'errorRut');
    activarValidacionRut('rutTecnico',    'errorRutTecnico');
    activarValidacionRut('rutFirmante',   'errorRutFirmante');
    activarValidacionEmail('email',       'errorEmail');
    activarValidacionTelefono('telefono', 'errorTelefono');

    // ── Reset ─────────────────────────────────────────────────────────────
    window.resetForm = function () {
        document.getElementById('instalacionForm').reset();
        padTecnico.clear();
        padFirmante.clear();
        document.getElementById('btnNuevaActa').style.display = 'none';

        // Limpiar radios de los checklists y resetear botones toggle
        document.querySelectorAll('#tbodyInstalacion input[type="radio"], #tbodyUsuario input[type="radio"], #tbodyValidacion input[type="radio"]')
            .forEach(r => { r.checked = false; r.dataset.checked = 'false'; });
        document.querySelectorAll('.marcar-si-btn').forEach(btn => {
            btn.dataset.active = 'false';
            btn.classList.remove('marcar-si-btn--active');
            btn.innerHTML = '✓ Marcar todo como Sí';
        });

        // Limpiar campo IP y serie
        const ipEl = document.getElementById('ipEquipo');
        if (ipEl) ipEl.value = '';
        const serieEl = document.getElementById('serie');
        if (serieEl) serieEl.value = '';

        // Limpiar clases y mensajes de validación
        ['rut', 'rutTecnico', 'rutFirmante', 'email', 'telefono'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.remove('input-valid', 'input-error');
        });
        ['errorRut', 'errorRutTecnico', 'errorRutFirmante', 'errorEmail', 'errorTelefono'].forEach(id => {
            const el = document.getElementById(id);
            if (el) { el.style.display = 'none'; el.textContent = ''; }
        });

        // Resetear comunas
        document.getElementById('ciudad').innerHTML = '<option value="">Seleccione Comuna</option>';

        // Fecha: se deja vacía hasta que el usuario la complete
        const fEl = document.getElementById('fecha');
        if (fEl) fEl.value = '';
    };

    // ── Esperar a que todas las imágenes (firmas, logo) estén cargadas ────
    // Esto es clave para que las firmas dibujadas (imágenes base64) queden
    // reflejadas en el PDF: html2canvas debe capturar el DOM únicamente
    // cuando todas las <img> ya terminaron de decodificarse.
    async function esperarImagenesCargadas(container) {
        const imgs = Array.from(container.querySelectorAll('img'));
        await Promise.all(imgs.map(img => {
            if (img.complete && img.naturalWidth > 0) return Promise.resolve();
            return new Promise(resolve => {
                const finalizar = () => resolve();
                img.addEventListener('load',  finalizar, { once: true });
                img.addEventListener('error', finalizar, { once: true });
                if (img.decode) {
                    img.decode().then(finalizar).catch(() => {});
                }
            });
        }));
        // Pequeño margen para que el navegador termine de pintar el frame
        await new Promise(resolve => setTimeout(resolve, 150));
    }

    // ── Construir nombre de archivo de descarga ────────────────────────────
    function construirNombreArchivo(data) {
        const limpiar = str => String(str || '')
            .trim()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // quitar tildes
            .replace(/[\\/:*?"<>|]/g, '')                       // caracteres inválidos en nombre de archivo
            .replace(/\s+/g, ' ')
            .trim();

        const partes = [];
        const organismo = limpiar(data.organismo);
        if (organismo) partes.push(organismo);
        const serie = limpiar(data.serie);
        if (serie) partes.push(serie);

        // Si no hay organismo ni serie ingresados, usar un nombre por defecto
        if (!partes.length) partes.push('Registro de Instalacion');

        return partes.join(' - ') + '.pdf';
    }

    // ── Generar PDF ───────────────────────────────────────────────────────
    window.generarPDF = async function () {

        // Recolectar checklists
        const checklistInstalacion = CHECKLIST_INSTALACION.map((item, i) => {
            if (item.tipo === 'text') {
                return { label: item.label, tipo: 'text', valor: document.getElementById(item.id)?.value || '' };
            }
            const radio = document.querySelector(`input[name="ci${i}"]:checked`);
            return { label: item.label, tipo: 'sino', valor: radio ? radio.value : '' };
        });

        const checklistUsuario = CHECKLIST_USUARIO.map((item, i) => {
            const radio = document.querySelector(`input[name="cu${i}"]:checked`);
            return { label: item.label, tipo: 'sino', valor: radio ? radio.value : '' };
        });

        const checklistValidacion = CHECKLIST_VALIDACION.map((item, i) => {
            const radio = document.querySelector(`input[name="cv${i}"]:checked`);
            return { label: item.label, tipo: 'sino', valor: radio ? radio.value : '' };
        });

        const data = {
            fecha:         document.getElementById('fecha').value,
            serie:         document.getElementById('serie').value,

            organismo:     document.getElementById('organismo').value,
            establecimiento: document.getElementById('establecimiento').value,
            direccion:     document.getElementById('direccion').value,
            region:        document.getElementById('region').value,
            ciudad:        document.getElementById('ciudad').value,
            unidad:        document.getElementById('unidad').value,

            nombre:        document.getElementById('nombre').value,
            cargo:         document.getElementById('cargo').value,
            rut:           document.getElementById('rut').value,
            email:         document.getElementById('email').value,
            telefono:      document.getElementById('telefono').value,

            checklistInstalacion,
            checklistUsuario,
            checklistValidacion,

            observaciones: document.getElementById('observaciones').value,

            nombreTecnico:  document.getElementById('nombreTecnico').value,
            rutTecnico:     document.getElementById('rutTecnico').value,
            firmaTecnico:   padTecnico.capture(),

            nombreFirmante: document.getElementById('nombreFirmante').value,
            rutFirmante:    document.getElementById('rutFirmante').value,
            firmaFirmante:  padFirmante.capture(),
        };

        const html     = generarContenidoActaInstalacion(data);
        const filename = construirNombreArchivo(data);

        // 1. Mostrar overlay PRIMERO y esperar que el navegador lo pinte
        const overlay = document.getElementById('pdfOverlay');
        overlay.style.display = 'flex';
        await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));

        // 2. Ahora crear el div temporal y renderizar
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        tempDiv.style.cssText = 'width:794px;background:#fff;padding:20px;position:fixed;top:10px;left:-10000px;z-index:9999;opacity:1;visibility:visible;';
        document.body.appendChild(tempDiv);

        // 3. Esperar a que TODAS las imágenes (firmas dibujadas y logo) estén
        //    completamente cargadas/decodificadas antes de capturar. Esto es
        //    lo que garantiza que la firma digital quede reflejada en el PDF.
        await esperarImagenesCargadas(tempDiv);

        try {
            const canvas = await html2canvas(tempDiv, {
                scale:           2,
                backgroundColor: '#ffffff',
                useCORS:         true,
                allowTaint:      true,
                imageTimeout:    15000,
                logging:         false,
            });
            const imgData = canvas.toDataURL('image/png');

            const JsPDFConstructor = (window.jspdf && window.jspdf.jsPDF)
                ? window.jspdf.jsPDF
                : (window.jsPDF || null);

            if (!JsPDFConstructor) throw new Error('jsPDF no disponible');

            const pdf  = new JsPDFConstructor({ unit: 'mm', format: 'a4', orientation: 'portrait' });
            const pdfW = pdf.internal.pageSize.getWidth();
            const pdfH = pdf.internal.pageSize.getHeight();
            const imgH = (canvas.height * pdfW) / canvas.width;

            if (imgH <= pdfH) {
                pdf.addImage(imgData, 'PNG', 0, 0, pdfW, imgH);
            } else {
                const scale   = pdfH / imgH;
                const scaledW = pdfW * scale;
                const xOffset = (pdfW - scaledW) / 2;
                pdf.addImage(imgData, 'PNG', xOffset, 0, scaledW, pdfH);
            }

            pdf.save(filename);
        } catch (e) {
            console.error('Error generando PDF:', e);
            alert('No se pudo generar el PDF. Por favor intente nuevamente.');
        } finally {
            document.body.removeChild(tempDiv);
            overlay.style.display = 'none';
        }

        document.getElementById('btnNuevaActa').style.display = 'inline-flex';
        document.getElementById('btnNuevaActa').onclick = resetForm;
    };

});
