import { useState, useEffect } from "react";

/* ═══════════════════════════════════════════════════════════════
   SISCONV-ACFFAA — PROTOTIPOS UI/UX COMPLETOS
   Sistema de Contratación CAS — Sector Defensa
   Mapeado 1:1 con Endpoints v2 (45 endpoints)
   ═══════════════════════════════════════════════════════════════ */

const C = {
  navy: "#0C1F33", navyL: "#15304D", blue: "#2563EB", blueL: "#3B82F6",
  green: "#059669", greenL: "#10B981", gold: "#D97706", goldL: "#F59E0B",
  red: "#DC2626", orange: "#EA580C", white: "#FFFFFF", bg: "#F0F2F5",
  g50: "#F8FAFC", g100: "#F1F5F9", g200: "#E2E8F0", g300: "#CBD5E1",
  g400: "#94A3B8", g500: "#64748B", g700: "#334155", g900: "#0F172A"
};

const MODULES = [
  { key: "M05", name: "Autenticación", icon: "🔐", color: C.navy, screens: [
    { id: "M05-LOGIN", name: "Inicio de Sesión", eps: ["E38"], methods: ["POST /auth/login"] },
  ]},
  { key: "M01", name: "Requerimiento", icon: "📋", color: C.blue, screens: [
    { id: "M01-LIST", name: "Listado de Perfiles", eps: ["E2"], methods: ["GET /perfiles"] },
    { id: "M01-NEW", name: "Registrar Perfil Atómico", eps: ["E1"], methods: ["POST /perfiles"] },
    { id: "M01-VALID", name: "Validar y Aprobar Perfil", eps: ["E3","E4"], methods: ["PUT /perfiles/{id}/validar", "PUT /perfiles/{id}/aprobar"] },
    { id: "M01-PDF", name: "Perfil del Puesto (PDF)", eps: ["E5"], methods: ["GET /perfiles/{id}/pdf"] },
    { id: "M01-REQ", name: "Elaborar Requerimiento", eps: ["E6"], methods: ["POST /requerimientos"] },
    { id: "M01-PPTO", name: "Verificar Presupuesto (OPP)", eps: ["E7"], methods: ["POST /requerimientos/{id}/verificar-presupuesto"] },
    { id: "M01-MOTOR", name: "Configurar Motor de Reglas", eps: ["E8"], methods: ["POST /requerimientos/{id}/configurar-reglas"] },
  ]},
  { key: "M02", name: "Convocatoria", icon: "📢", color: C.green, screens: [
    { id: "M02-CONV", name: "Crear Convocatoria", eps: ["E9"], methods: ["POST /convocatorias"] },
    { id: "M02-CRONO", name: "Cronograma", eps: ["E10"], methods: ["POST /convocatorias/{id}/cronograma"] },
    { id: "M02-COMITE", name: "Comité de Selección", eps: ["E11"], methods: ["POST /convocatorias/{id}/comite"] },
    { id: "M02-FACT", name: "Factores de Evaluación", eps: ["E12"], methods: ["POST /convocatorias/{id}/factores"] },
    { id: "M02-ACTA", name: "Acta de Instalación", eps: ["E13","E14"], methods: ["POST .../acta-instalacion","PUT .../acta-instalacion/cargar"] },
    { id: "M02-PUB", name: "Aprobar y Publicar", eps: ["E15"], methods: ["PUT /convocatorias/{id}/aprobar"] },
    { id: "M02-BASES", name: "Bases PDF", eps: ["E16"], methods: ["GET /convocatorias/{id}/bases-pdf"] },
  ]},
  { key: "M03", name: "Selección", icon: "🎯", color: C.orange, screens: [
    { id: "M03-POST", name: "Postular a Convocatoria", eps: ["E17"], methods: ["POST /postulaciones"] },
    { id: "M03-EXP", name: "Expediente Virtual", eps: ["E18"], methods: ["POST .../expediente"] },
    { id: "M03-DL", name: "Verificar D.L. 1451", eps: ["E19"], methods: ["POST .../verificar-dl1451"] },
    { id: "M03-FILTRO", name: "Filtro Requisitos Mínimos", eps: ["E20"], methods: ["POST .../filtro-requisitos"] },
    { id: "M03-TACHA", name: "Gestionar Tachas", eps: ["E21","E22"], methods: ["POST .../tachas","PUT .../tachas/{id}/resolver"] },
    { id: "M03-LISTA", name: "Listado Postulantes", eps: ["E23"], methods: ["GET .../postulantes"] },
    { id: "M03-CURR", name: "Evaluación Curricular", eps: ["E24"], methods: ["POST .../eval-curricular"] },
    { id: "M03-COD", name: "Códigos Anónimos", eps: ["E25"], methods: ["POST .../codigos-anonimos"] },
    { id: "M03-TEC", name: "Evaluación Técnica", eps: ["E26"], methods: ["POST .../eval-tecnica"] },
    { id: "M03-ENT", name: "Entrevista Personal", eps: ["E27"], methods: ["POST .../entrevistas"] },
    { id: "M03-BONIF", name: "Bonificaciones", eps: ["E28"], methods: ["POST .../bonificaciones"] },
    { id: "M03-MERIT", name: "Cuadro de Méritos", eps: ["E29","E30"], methods: ["POST .../cuadro-meritos","GET .../resultados-pdf"] },
    { id: "M03-RESULT", name: "Publicar Resultados", eps: ["E31"], methods: ["POST .../publicar-resultados"] },
  ]},
  { key: "M04", name: "Contrato", icon: "📝", color: C.red, screens: [
    { id: "M04-NOTIF", name: "Notificar Ganador", eps: ["E32"], methods: ["POST .../notificar-ganador"] },
    { id: "M04-VERIF", name: "Verificar Documentos", eps: ["E33"], methods: ["POST .../verificar-documentos"] },
    { id: "M04-CONT", name: "Suscribir Contrato", eps: ["E34"], methods: ["POST .../suscribir"] },
    { id: "M04-ACCES", name: "Convocar Accesitario", eps: ["E35"], methods: ["POST .../convocar-accesitario"] },
    { id: "M04-PLAN", name: "Registrar Planilla", eps: ["E36"], methods: ["PUT .../registrar-planilla"] },
    { id: "M04-CLOSE", name: "Cerrar Proceso", eps: ["E37"], methods: ["PUT .../cerrar"] },
  ]},
  { key: "M10", name: "Administración", icon: "⚙️", color: C.g500, screens: [
    { id: "M10-CAT", name: "Catálogos", eps: ["E41"], methods: ["GET /catalogos/{codigo}"] },
    { id: "M10-AREAS", name: "Áreas Organizacionales", eps: ["E42"], methods: ["GET /areas"] },
    { id: "M10-USERS", name: "Gestión de Usuarios", eps: ["E43"], methods: ["GET /usuarios"] },
    { id: "M10-NOTIF", name: "Notificaciones", eps: ["E44"], methods: ["GET /notificaciones"] },
    { id: "M10-LOG", name: "Log de Transparencia", eps: ["E45"], methods: ["GET .../log-transparencia"] },
  ]},
];

const JUST = {
  "M05-LOGIN": "Obligatoria como punto de entrada. Sin autenticación JWT no se accede a ningún módulo. BCrypt strength=12 para contraseñas. Access Token 30min + Refresh Token 24h. Alineado con la capa de Seguridad del SAD (7 capas de defensa en profundidad).",
  "M01-LIST": "Tabla paginada server-side (20 reg/pág) que alimenta el flujo BPMN Etapa 1. Columnas mapeadas directamente a TBL_PERFIL_PUESTO. Filtro por dependencia y estado. Acciones: Editar, Historial, PDF, Solicitar Aprobación.",
  "M01-NEW": "Formulario multi-tab (4 pestañas) basado en RPE 065-2020-SERVIR. Tab 1: Datos Generales → campos de TBL_PERFIL_PUESTO. Tab 2: Formación Académica. Tab 3: Conocimientos (matriz ofimática con nivel dominio). Tab 4: Experiencia.",
  "M01-VALID": "Gateway BPMN '¿Es correcto?' de Etapa 1, ORH. Pantalla de revisión con checklist MPP vigente. Si aprueba → APROBADO + genera PDF + notifica Área Solicitante. Si rechaza → RECHAZADO + motivo. Consume E3 (validar) y E4 (aprobar).",
  "M01-PDF": "Visor PDF inline generado por JasperReports, se muestra PDF del Perfil del Puesto embebido con controles de zoom y navegación. Consolida datos de TBL_PERFIL_PUESTO.",
  "M01-REQ": "Formulario simple del Área Solicitante. Asocia perfil APROBADO al requerimiento. SEQ_NUM_REQUERIMIENTO genera numeración automática. Estado ELABORADO. Tarea BPMN 'Elaborar Requerimiento de Contratación'.",
  "M01-PPTO": "Pantalla exclusiva de OPP (ROLE_OPP). Gateway BPMN '¿Existen recursos?'. Si SÍ → emite certificación + SIAF → CON_PRESUPUESTO. Si NO → SIN_PRESUPUESTO → evento fin error. Sin esto no se puede crear convocatoria.",
  "M01-MOTOR": "Configuración RF-14 con validación CK_CONV_PESOS (suma=100%). Sliders visuales para distribución de pesos. Umbrales mínimos por etapa. Estado CONFIGURADO habilita Etapa 2.",
  "M02-CONV": "Formulario basado en pantalla 'Editar Convocatoria' de SIPROS (cap_07). Campos: N° CAS automático, Objeto, Fuente Financiamiento, Código AIRHSP, Memorando, Duración, Horario (timepicker De/A), Lugar. Hereda pesos del Motor RF-14.",
  "M02-CRONO": "Tabla de cronograma con etapas, fechas, responsables. Filtro por año. Columnas: Código, Aprobación, Publicación, Evaluación Escrita, Convocatorias asociadas.",
  "M02-COMITE": "Registro de miembros del comité con botones de reporte y notificación. DataTable con Copiar/CSV/Imprimir. Columnas: Nombre, Oficina, Cargo, Eliminar.",
  "M02-FACT": "Tabla dinámica de factores por etapa evaluación (CURRICULAR/TECNICA/ENTREVISTA). Cada factor: criterio, puntaje max/min, peso, orden. Valida consistencia con pesos del Motor RF-14. Alimenta TBL_FACTOR_EVALUACION.",
  "M02-ACTA": "Dos fases: (1) Generar PDF con JasperReports (E13), (2) Cargar acta firmada multipart/form-data (E14), Aquí se genera el acta, se descarga, firma físicamente, escanea y sube.",
  "M02-PUB": "Panel de publicación SIMULTÁNEA en Portal ACFFAA + Talento Perú (D.S. 065-2011-PCM). Genera bases PDF (E16), aprueba (E15). Notifica Gestión de Empleo. Mínimo 10 días hábiles publicación.",
  "M02-BASES": "Visor PDF de bases completas. Consolida 4 tablas: TBL_CONVOCATORIA + CRONOGRAMA + PERFIL_PUESTO + FACTOR_EVALUACION. Incluye perfil, requisitos, cronograma, factores, bonificaciones, marco legal.",
  "M03-POST": "Formulario multi-step para postulante. Step 1: Datos personales (TBL_POSTULANTE). Step 2: Condición especial (checkboxes bonificaciones). Step 3: DDJJ obligatorias RF-06. Step 4: Expediente. Estado → REGISTRADO en Statechart.",
  "M03-EXP": "Zona drag-and-drop para subir documentos PDF/imagen como multipart. Hash SHA-256 automático por archivo para verificación posterior en Etapa 4. Almacena en TBL_EXPEDIENTE_VIRTUAL.",
  "M03-DL": "Checklist D.L. 1451: verificación RNSSC + REGIPREC. Si no pasa → NO_APTO. Tarea BPMN 'Ejecutar Checklist D.L. 1451 RF-08'. Panel para ORH con estados por verificación.",
  "M03-FILTRO": "Motor RF-07 automático. Compara perfil atómico vs datos del postulante. Resultado: INSCRITO (cumple todo) o NO_APTO. Tabla resumen con checkmarks por requisito. Ejecuta para todos los postulantes simultáneamente.",
  "M03-TACHA": "Período 24h RF-12. Vista dual: Postulante registra tacha (E21) con motivo y evidencia. ORH resuelve (E22): FUNDADA → DESCALIFICADO, INFUNDADA → continúa. Timer visual de 24 horas.",
  "M03-LISTA": "Tabla paginada server-side (E23) de postulantes por convocatoria. Estado Statechart visible (REGISTRADO→INSCRITO→APTO→etc.). Filtros por estado. Export Excel/PDF. 20 registros por página.",
  "M03-CURR": "Interfaz del Comité para evaluar por criterios RF-09. Por postulante: grilla de criterios con puntaje max, campo para puntaje real, total automático. Si ≥ umbral → APTO, sino → NO_APTO.",
  "M03-COD": "Asignación RF-10 de códigos SEQ_CODIGO_ANONIMO (ANON-XXXX). Una vez asignados, Comité NUNCA ve nombres. Cumplimiento D.L. 1451 transparencia. Panel para ORH exclusivamente.",
  "M03-TEC": "Evaluación ciega RF-11. SOLO códigos anónimos visibles. Puntaje por código. idEvaluador del JWT (nunca en request). Si < umbral → NO_APTO. Diseño con fondo diferenciado + aviso legal.",
  "M03-ENT": "Entrevista RF-13 con verificación de quórum. Grilla: criterios × miembros. Puntaje por cada miembro del comité. Promedio calculado. Datos reunión: fecha, hora, lugar. Opción reemplazante.",
  "M03-BONIF": "Motor RF-15 automático. Bonificaciones: FF.AA. 10% (Ley 29248), Discapacidad 15% (Ley 29973), Deportistas 5% (Ley 27674). Se aplican sobre puntaje final según DDJJ del postulante.",
  "M03-MERIT": "Cuadro final RF-16. Fórmula: (Curr×P1)+(Téc×P2)+(Ent×P3)+Bonif. Posición 1=GANADOR, siguientes=ACCESITARIOS. Genera Actas PDF y Cuadro Méritos PDF. Botones E29 + E30.",
  "M03-RESULT": "Publicación final. Notifica a TODOS los postulantes. Registra en TBL_LOG_TRANSPARENCIA (RF-18). Estado → RESULTADO_PUBLICADO. No tiene equivalente en SIPROS (pantalla nueva).",
  "M04-NOTIF": "Notifica ganador RF-17 con plazo para presentar documentos originales. Si no presenta → habilita convocar accesitario. Tarea BPMN Etapa 4.1-4.2.",
  "M04-VERIF": "Verificación SHA-256: compara hash del expediente virtual (Etapa 3) vs documentos originales presentados. Gateway '¿Docs válidos?'. Panel comparativo con Match/No Match.",
  "M04-CONT": "Contrato CAS D.Leg. 1057. Campos: fechas, monto, funciones (del perfil), dependencia. Firma bilateral RN-25. SEQ_NUM_CONTRATO. Tarea BPMN 4.6.",
  "M04-ACCES": "Lista de accesitarios en orden de mérito. Si ganador rechaza/no presenta → siguiente. Si nadie → DESIERTO. Tareas BPMN 4.5 + 4.8.",
  "M04-PLAN": "Registro en planilla electrónica. Máx. 5 días hábiles (D.S. 018-2007-TR). Timer visual. Tarea BPMN 4.7.",
  "M04-CLOSE": "Cierre final: FINALIZADO o DESIERTO. Log Transparencia. Estado inmutable. Genera reporte PDF de cierre. Tarea BPMN 4.8.",
  "M10-CAT": "CRUD de catálogos paramétricos (TBL_CATALOGO_*). Sin deploy. Alimenta dropdowns de todo el sistema. Tipos: TIPO_DOC, NIVEL_FORMACION, MOTIVO_REQUERIMIENTO, etc.",
  "M10-AREAS": "Listado TBL_AREA_ORGANIZACIONAL. Selector que se usa en perfiles, requerimientos y convocatorias.",
  "M10-USERS": "Gestión TBL_USUARIO + TBL_USUARIO_ROL. Asignación RBAC de 6 roles. Activar/Desactivar usuarios.",
  "M10-NOTIF": "Bandeja TBL_NOTIFICACION filtrada por JWT. Badge contador. Mark-as-read. Paginada. Endpoint E44 nuevo.",
  "M10-LOG": "Consulta TBL_LOG_TRANSPARENCIA particionada (D.L. 1451). Índices LOCAL. Filtros: convocatoria, fecha, usuario. Export. Endpoint E45 nuevo.",
};

const Btn = ({ children, color = C.blue, outline, sm, onClick, disabled }) => (
  <button onClick={onClick} disabled={disabled} style={{
    background: outline ? "transparent" : color, color: outline ? color : C.white,
    border: outline ? `1.5px solid ${color}` : "none", borderRadius: 7,
    padding: sm ? "4px 10px" : "7px 16px", fontSize: sm ? 10 : 11,
    fontWeight: 600, cursor: disabled ? "default" : "pointer", opacity: disabled ? 0.5 : 1,
    letterSpacing: 0.2, transition: "all 0.2s"
  }}>{children}</button>
);

const Badge = ({ children, color = C.blue }) => (
  <span style={{ background: `${color}18`, color, fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 10, letterSpacing: 0.3 }}>{children}</span>
);

const Field = ({ label, req, type = "text", value = "", span2, ph }) => (
  <div style={{ gridColumn: span2 ? "1/-1" : undefined }}>
    <label style={{ fontSize: 10.5, fontWeight: 600, color: C.g700, display: "block", marginBottom: 3 }}>
      {label} {req && <span style={{ color: C.red }}>*</span>}
    </label>
    {type === "textarea" ? (
      <div style={{ border: `1px solid ${C.g300}`, borderRadius: 6, padding: "7px 10px", fontSize: 11, color: C.g400, minHeight: 48, background: C.g50, lineHeight: 1.5 }}>{ph || value || "..."}</div>
    ) : type === "select" ? (
      <div style={{ border: `1px solid ${C.g300}`, borderRadius: 6, padding: "7px 10px", fontSize: 11, color: C.g400, background: C.g50, display: "flex", justifyContent: "space-between" }}>
        <span>{ph || "— SELECCIONAR —"}</span><span>▾</span>
      </div>
    ) : type === "check" ? (
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <div style={{ width: 15, height: 15, border: `2px solid ${C.g300}`, borderRadius: 3 }} />
        <span style={{ fontSize: 11, color: C.g500 }}>{ph}</span>
      </div>
    ) : (
      <div style={{ border: `1px solid ${C.g300}`, borderRadius: 6, padding: "7px 10px", fontSize: 11, color: value ? C.g700 : C.g400, background: C.g50 }}>{value || ph || "..."}</div>
    )}
  </div>
);

const Table = ({ cols, rows, actions }) => (
  <div style={{ border: `1px solid ${C.g200}`, borderRadius: 8, overflow: "hidden" }}>
    <div style={{ display: "grid", gridTemplateColumns: cols.map(c => c.w || "1fr").join(" "), background: C.blue, color: C.white }}>
      {cols.map((c, i) => <div key={i} style={{ padding: "7px 10px", fontSize: 10, fontWeight: 700, letterSpacing: 0.3 }}>{c.h}</div>)}
    </div>
    {rows.map((row, ri) => (
      <div key={ri} style={{ display: "grid", gridTemplateColumns: cols.map(c => c.w || "1fr").join(" "), borderTop: `1px solid ${C.g100}`, background: ri % 2 ? C.white : C.g50 }}>
        {row.map((cell, ci) => (
          <div key={ci} style={{ padding: "7px 10px", fontSize: 10.5, color: C.g700, display: "flex", alignItems: "center" }}>
            {typeof cell === "object" ? cell : cell}
          </div>
        ))}
      </div>
    ))}
    <div style={{ padding: "6px 10px", fontSize: 10, color: C.g400, borderTop: `1px solid ${C.g100}`, display: "flex", justifyContent: "space-between" }}>
      <span>Mostrando 1-{rows.length} de {rows.length} registros</span>
      <div style={{ display: "flex", gap: 4 }}>
        <span style={{ padding: "1px 6px", background: C.g100, borderRadius: 3, cursor: "pointer" }}>◀</span>
        <span style={{ padding: "1px 6px", background: C.blue, color: C.white, borderRadius: 3 }}>1</span>
        <span style={{ padding: "1px 6px", background: C.g100, borderRadius: 3, cursor: "pointer" }}>▶</span>
      </div>
    </div>
  </div>
);

const Tabs = ({ items, active = 0 }) => (
  <div style={{ display: "flex", borderBottom: `2px solid ${C.g200}`, marginBottom: 16 }}>
    {items.map((t, i) => (
      <div key={i} style={{
        padding: "8px 18px", fontSize: 11, fontWeight: i === active ? 700 : 400,
        color: i === active ? C.blue : C.g400,
        borderBottom: i === active ? `2.5px solid ${C.blue}` : "none",
        marginBottom: -2, cursor: "pointer", transition: "all 0.2s"
      }}>
        <span style={{ background: i === active ? C.blue : C.g300, color: C.white, borderRadius: "50%", width: 18, height: 18, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 9, marginRight: 6 }}>{i + 1}</span>
        {t}
      </div>
    ))}
  </div>
);

const PdfViewer = ({ title }) => (
  <div style={{ background: C.g50, border: `1px solid ${C.g200}`, borderRadius: 10, padding: 24, textAlign: "center" }}>
    <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 12 }}>
      <span style={{ background: C.g200, padding: "3px 10px", borderRadius: 4, fontSize: 10 }}>1 / 4</span>
      <span style={{ fontSize: 10, color: C.g400 }}>— 100% + 🔍</span>
    </div>
    <div style={{ background: C.white, border: `1px solid ${C.g200}`, borderRadius: 4, padding: 24, maxWidth: 400, margin: "0 auto", minHeight: 300 }}>
      <div style={{ fontSize: 16, fontWeight: 800, color: C.navy, marginBottom: 12, letterSpacing: -0.5 }}>{title}</div>
      <div style={{ height: 1, background: C.g200, margin: "10px 0" }} />
      {[1, 2, 3, 4, 5].map(i => <div key={i} style={{ height: 8, background: C.g100, borderRadius: 3, marginBottom: 6, width: `${90 - i * 8}%` }} />)}
      <div style={{ height: 1, background: C.g200, margin: "16px 0" }} />
      {[1, 2, 3].map(i => <div key={i} style={{ height: 8, background: C.g100, borderRadius: 3, marginBottom: 6 }} />)}
    </div>
    <div style={{ marginTop: 12, display: "flex", gap: 8, justifyContent: "center" }}>
      <Btn color={C.blue}>⬇ Descargar PDF</Btn>
      <Btn color={C.g500}>🖨 Imprimir</Btn>
    </div>
  </div>
);

const ProgressBar = ({ label, value, max = 100, color }) => (
  <div style={{ marginBottom: 10 }}>
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5, fontWeight: 600, marginBottom: 3 }}>
      <span style={{ color: C.g700 }}>{label}</span>
      <span style={{ color }}>{value}%</span>
    </div>
    <div style={{ height: 7, background: C.g200, borderRadius: 4 }}>
      <div style={{ height: 7, background: color, borderRadius: 4, width: `${value}%`, transition: "width 0.5s" }} />
    </div>
  </div>
);

const Alert = ({ type = "info", children }) => {
  const colors = { info: C.blue, warn: C.gold, error: C.red, success: C.green };
  const icons = { info: "ℹ️", warn: "⚠️", error: "❌", success: "✅" };
  return (
    <div style={{ background: `${colors[type]}10`, border: `1px solid ${colors[type]}30`, borderRadius: 8, padding: "10px 14px", display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 12 }}>
      <span style={{ fontSize: 14 }}>{icons[type]}</span>
      <div style={{ fontSize: 11, color: C.g700, lineHeight: 1.5 }}>{children}</div>
    </div>
  );
};

/* ═══════ SCREEN CONTENT RENDERER ═══════ */
const ScreenContent = ({ sid }) => {
  switch (sid) {
    case "M05-LOGIN":
      return (
        <div style={{ maxWidth: 380, margin: "20px auto", textAlign: "center" }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, background: `linear-gradient(135deg, ${C.navy}, ${C.blue})`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", fontSize: 28 }}>🏛️</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: C.navy, letterSpacing: -0.5 }}>SISCONV-ACFFAA</div>
          <div style={{ fontSize: 10, color: C.g400, marginBottom: 24, letterSpacing: 1 }}>SISTEMA DE CONTRATACIÓN CAS </div>
          <div style={{ textAlign: "left" }}>
            <Field label="Usuario" req ph="Ingrese su usuario" />
            <div style={{ height: 10 }} />
            <Field label="Contraseña" req ph="••••••••" />
          </div>
          <button style={{ width: "100%", marginTop: 18, background: `linear-gradient(135deg, ${C.navy}, ${C.blue})`, color: C.white, border: "none", borderRadius: 8, padding: 11, fontSize: 12, fontWeight: 700, cursor: "pointer", letterSpacing: 0.5 }}>INICIAR SESIÓN</button>
          <div style={{ fontSize: 9, color: C.g400, marginTop: 12 }}>JWT Access Token: 30min · Refresh: 24h · BCrypt s=12</div>
        </div>
      );

    case "M01-LIST":
      return (
        <>
          <div style={{ display: "flex", gap: 8, marginBottom: 12, alignItems: "center" }}>
            <div style={{ flex: 1, border: `1px solid ${C.g300}`, borderRadius: 6, padding: "6px 10px", fontSize: 11, color: C.g400 }}>🔍 Buscar por nombre, código...</div>
            <Field label="" type="select" ph="Dependencia: TODAS" />
            <Btn color={C.green}>+ Insertar Perfil</Btn>
          </div>
          <Table cols={[
            { h: "#", w: "40px" }, { h: "Código", w: "70px" }, { h: "Tipo" }, { h: "Nombre", w: "1.5fr" },
            { h: "Denom. Puesto" }, { h: "Nivel" }, { h: "Remuneración" }, { h: "Estado" }, { h: "Acciones", w: "100px" }
          ]} rows={[
            ["1", "1444", <Badge>728</Badge>, "Profesional P-6", "Profesional", "P-6", "S/ 10,500", <Badge color={C.gold}>En Construcción</Badge>, "✏️ 🔄 📄"],
            ["2", "1442", <Badge color={C.green}>CAS</Badge>, "Técnico II", "Técnico", "V Nivel T5", "S/ 2,800", <Badge color={C.gold}>En Construcción</Badge>, "✏️ 🔄 📄"],
            ["3", "1404", <Badge color={C.green}>CAS</Badge>, "Esp. Calidad Software III", "Profesional", "SP ES Nivel P6", "S/ 9,000", <Badge color={C.green}>Aprobado</Badge>, "✏️ 🔄 📄"],
            ["4", "1393", <Badge color={C.green}>CAS</Badge>, "Esp. Análisis Datos I", "Profesional", "SP ES Nivel P5", "S/ 5,200", <Badge color={C.green}>Aprobado</Badge>, "✏️ 🔄 📄"],
          ]} />
        </>
      );

    case "M01-NEW":
      return (
        <>
          <Tabs items={["Datos Generales", "Formación Académica", "Conocimientos", "Experiencia"]} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Field label="Tipo" type="select" req ph="CAS" />
            <Field label="Motivo Requerimiento" type="select" req />
            <Field label="Órgano" type="select" req ph="SG - SECRETARÍA GENERAL" />
            <Field label="Unidad Orgánica" type="select" req ph="OI - OF. INFORMÁTICA..." />
            <Field label="Denominación Puesto" type="select" req />
            <Field label="Nivel Puesto" type="select" req />
            <Field label="Nombre del cargo/puesto" req ph="Profesional P-6" />
            <Field label="Remuneración" req value="10,500.00" />
            <Field label="Misión del Puesto" type="textarea" req span2 ph="Brindar asesoramiento técnico legal en la atención y manejo de quejas..." />
            <Field label="Funciones del Puesto" type="textarea" req span2 ph="1. Elaborar informes técnicos... 2. Analizar propuestas normativas..." />
          </div>
          <div style={{ marginTop: 16, display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <Btn color={C.g500} outline>Cancelar</Btn>
            <Btn color={C.green}>💾 Guardar Perfil</Btn>
          </div>
        </>
      );

    case "M01-VALID":
      return (
        <>
          <Alert type="info">Este perfil está en estado <strong>PENDIENTE</strong>. Valide contra el MPP vigente antes de aprobar.</Alert>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
            <Field label="Denominación" value="Profesional P-6" />
            <Field label="Área" value="OGITD" />
            <Field label="Formación" value="Universitario Completo" />
            <Field label="Experiencia General" value="4 años" />
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.navy, marginBottom: 8 }}>Checklist de validación contra MPP:</div>
          {["Denominación coincide con MPP vigente", "Nivel remunerativo autorizado", "Funciones alineadas al ROF", "Perfil cumple requisitos mínimos RPE 065-2020"].map((c, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0", borderBottom: `1px solid ${C.g100}` }}>
              <div style={{ width: 16, height: 16, border: `2px solid ${C.green}`, borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: C.green }}>✓</div>
              <span style={{ fontSize: 11, color: C.g700 }}>{c}</span>
            </div>
          ))}
          <Field label="Observaciones" type="textarea" span2 ph="Opcional: motivo de rechazo o comentarios..." />
          <div style={{ marginTop: 16, display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <Btn color={C.red}>✗ Rechazar</Btn>
            <Btn color={C.green}>✓ Aprobar Perfil</Btn>
          </div>
        </>
      );

    case "M01-PDF": return <PdfViewer title="PERFIL DEL PUESTO" />;
    case "M02-BASES": return <PdfViewer title="BASES DE CONVOCATORIA CAS N° 001-2026-ACFFAA" />;

    case "M01-REQ":
      return (
        <>
          <Alert type="info">Seleccione un perfil <strong>APROBADO</strong> para asociar al requerimiento. El número se genera automáticamente.</Alert>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Field label="N° Requerimiento" value="REQ-2026-0015 (autogenerado)" />
            <Field label="Perfil Aprobado" type="select" req ph="1404 - Esp. Calidad Software III" />
            <Field label="Justificación" type="textarea" req span2 ph="Se requiere profesional para..." />
            <Field label="Cantidad de Puestos" req value="1" />
            <Field label="Fecha de Necesidad" req ph="dd/mm/yyyy" />
          </div>
          <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}><Btn color={C.blue}>📋 Registrar Requerimiento</Btn></div>
        </>
      );

    case "M01-PPTO":
      return (
        <>
          <Alert type="warn">Gateway BPMN: ¿Existen recursos presupuestales para esta contratación?</Alert>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
            <Field label="Requerimiento" value="REQ-2026-0015" />
            <Field label="Monto Remuneración" value="S/ 9,000.00" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Field label="¿Existen recursos?" type="select" req ph="— SÍ / NO —" />
            <Field label="N° Certificación Presupuestal" req ph="CERT-2026-000XXX" />
            <Field label="N° SIAF" req ph="000XXXX" />
            <Field label="Observaciones OPP" type="textarea" ph="..." />
          </div>
          <div style={{ marginTop: 16, display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <Btn color={C.red}>❌ Sin Presupuesto</Btn>
            <Btn color={C.green}>✓ Con Presupuesto</Btn>
          </div>
        </>
      );

    case "M01-MOTOR":
      return (
        <>
          <Alert type="info">Configure los pesos ponderados del Motor RF-14. La suma DEBE ser exactamente 100% (CK_CONV_PESOS).</Alert>
          <ProgressBar label="Evaluación Curricular" value={40} color={C.green} />
          <ProgressBar label="Evaluación Técnica" value={35} color={C.blue} />
          <ProgressBar label="Entrevista Personal" value={25} color={C.orange} />
          <div style={{ textAlign: "right", fontSize: 14, fontWeight: 800, color: C.green, marginTop: 4 }}>Total: 100% ✓</div>
          <div style={{ height: 1, background: C.g200, margin: "14px 0" }} />
          <div style={{ fontSize: 11, fontWeight: 700, color: C.navy, marginBottom: 8 }}>Umbrales mínimos por etapa:</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            <Field label="Umbral Curricular" req value="60 pts" />
            <Field label="Umbral Técnico" req value="50 pts" />
            <Field label="Umbral Entrevista" req value="40 pts" />
          </div>
          <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}><Btn color={C.blue}>⚙️ Guardar Configuración</Btn></div>
        </>
      );

    case "M02-CONV":
      return (
        <>
          <div style={{ background: C.red + "10", border: `1px solid ${C.red}30`, borderRadius: 8, padding: "8px 14px", marginBottom: 12, fontSize: 12, fontWeight: 700, color: C.red, textAlign: "center" }}>CAS N° 001-2026-ACFFAA</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Field label="Nombre Puesto" value="Especialista en Calidad de Software III" />
            <Field label="Objeto" type="textarea" req span2 ph="Contratar por suplencia a un/a (01) Titulado/a..." />
            <Field label="Fuente Financiamiento" type="select" req />
            <Field label="Código AIRHSP" req />
            <Field label="Memorando OGPP" req />
            <Field label="Duración Contrato" req ph="29/01/2026" />
            <Field label="Horario De" value="09:00" />
            <Field label="Horario A" value="17:30" />
            <Field label="Inicio de Labores" type="textarea" req ph="Inicio al día siguiente de la suscripción..." />
            <Field label="Lugar Prestación" value="OGITD - OF. GRAL. TECNOLOGÍAS" />
            <Field label="Dirección" req />
            <Field label="Remuneración Mensual" req value="9,000.00" />
          </div>
          <div style={{ marginTop: 16, display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <Btn color={C.g500} outline>Cancelar</Btn>
            <Btn color={C.green}>💾 Guardar Convocatoria</Btn>
          </div>
        </>
      );

    case "M02-CRONO":
      return (
        <>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <Field label="" type="select" ph="Año: 2026" />
            <Btn color={C.green} sm>+ Insertar</Btn>
          </div>
          <Table cols={[
            { h: "Código", w: "70px" }, { h: "Etapa" }, { h: "Fecha Inicio" }, { h: "Fecha Fin" },
            { h: "Responsable" }, { h: "Lugar" }, { h: "Acciones", w: "80px" }
          ]} rows={[
            ["1", "Publicación", "29/01/2026", "10/02/2026", "ORH", "Portal + Talento Perú", "✏️ 🗑"],
            ["2", "Postulación", "11/02/2026", "17/02/2026", "Postulantes", "Portal SISCONV", "✏️ 🗑"],
            ["3", "Eval. Curricular", "18/02/2026", "20/02/2026", "Comité", "Oficina ORH", "✏️ 🗑"],
            ["4", "Eval. Técnica", "21/02/2026", "22/02/2026", "Comité", "Sala 3er piso", "✏️ 🗑"],
            ["5", "Entrevista", "24/02/2026", "25/02/2026", "Comité", "Sala 3er piso", "✏️ 🗑"],
            ["6", "Resultados", "26/02/2026", "26/02/2026", "ORH", "Portal", "✏️ 🗑"],
          ]} />
        </>
      );

    case "M02-COMITE":
      return (
        <>
          <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
            <Btn color="#7C3AED" sm>📊 Reporte Analista</Btn>
            <Btn color={C.green} sm>📊 Reporte Comité Entrevista</Btn>
            <Btn color={C.blue} sm>📧 Notificar Analista</Btn>
            <Btn color={C.green} sm>+ Insertar</Btn>
            <Btn color={C.g500} sm outline>↩ Volver</Btn>
          </div>
          <Table cols={[
            { h: "#", w: "40px" }, { h: "Nombre" }, { h: "Oficina" }, { h: "Cargo" }, { h: "Eliminar", w: "70px" }
          ]} rows={[
            ["1", "García López, María Elena", "OGITD", "Presidente", "🗑"],
            ["2", "Torres Quispe, Juan Carlos", "ORH", "Secretario", "🗑"],
            ["3", "Mendoza Ruiz, Ana Lucía", "OGITD", "Vocal", "🗑"],
          ]} />
        </>
      );

    case "M03-POST":
      return (
        <>
          <Tabs items={["Datos Personales", "Condición Especial", "Declaraciones Juradas", "Expediente Virtual"]} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Field label="Tipo Documento" type="select" req ph="DNI" />
            <Field label="N° Documento" req ph="12345678" />
            <Field label="Apellido Paterno" req />
            <Field label="Apellido Materno" req />
            <Field label="Nombres" req />
            <Field label="Email" req ph="correo@mail.com" />
            <Field label="Teléfono" req ph="987654321" />
            <Field label="Fecha Nacimiento" req ph="dd/mm/yyyy" />
            <Field label="Dirección" span2 req />
            <Field label="Departamento" type="select" />
            <Field label="Provincia" type="select" />
            <Field label="Distrito" type="select" />
          </div>
          <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}><Btn color={C.orange}>Siguiente →</Btn></div>
        </>
      );

    case "M03-TEC":
      return (
        <>
          <Alert type="warn"><strong>🔒 MODO EVALUACIÓN ANÓNIMA — D.L. 1451</strong><br/>Los nombres e identidades NO son visibles. Solo se muestran códigos anónimos. El idEvaluador se extrae del JWT automáticamente.</Alert>
          <Table cols={[
            { h: "Código Anónimo", w: "120px" }, { h: "Criterio 1 (max 20)" }, { h: "Criterio 2 (max 30)" },
            { h: "Criterio 3 (max 50)" }, { h: "Total" }, { h: "Estado" }
          ]} rows={[
            [<strong style={{ color: C.orange }}>ANON-1024</strong>, "18", "25", "42", <strong>85</strong>, <Badge color={C.green}>APTO</Badge>],
            [<strong style={{ color: C.orange }}>ANON-1025</strong>, "15", "20", "38", <strong>73</strong>, <Badge color={C.green}>APTO</Badge>],
            [<strong style={{ color: C.orange }}>ANON-1026</strong>, "10", "12", "20", <strong style={{ color: C.red }}>42</strong>, <Badge color={C.red}>NO_APTO</Badge>],
          ]} />
        </>
      );

    case "M03-MERIT":
      return (
        <>
          <Alert type="success">Cuadro de Méritos calculado con fórmula: (Curr×40%) + (Téc×35%) + (Ent×25%) + Bonificaciones</Alert>
          <Table cols={[
            { h: "Pos.", w: "40px" }, { h: "Código" }, { h: "Curricular (×40%)" }, { h: "Técnica (×35%)" },
            { h: "Entrevista (×25%)" }, { h: "Bonif." }, { h: "TOTAL", w: "70px" }, { h: "Resultado" }
          ]} rows={[
            [<strong style={{ color: C.gold }}>1°</strong>, "ANON-1024", "34.0", "29.75", "22.5", "+9.5%", <strong style={{ color: C.green }}>95.77</strong>, <Badge color={C.green}>GANADOR</Badge>],
            ["2°", "ANON-1025", "28.8", "25.55", "20.0", "—", <strong>74.35</strong>, <Badge color={C.blue}>ACCESITARIO</Badge>],
            ["3°", "ANON-1027", "26.0", "22.40", "18.75", "—", <strong>67.15</strong>, <Badge color={C.blue}>ACCESITARIO</Badge>],
          ]} />
          <div style={{ marginTop: 16, display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <Btn color={C.red}>📄 Generar Actas PDF</Btn>
            <Btn color={C.blue}>📊 Cuadro Méritos PDF</Btn>
          </div>
        </>
      );

    case "M04-VERIF":
      return (
        <>
          <Alert type="info">Verificación SHA-256: compare el hash del expediente virtual con los documentos originales presentados.</Alert>
          <Table cols={[
            { h: "Documento" }, { h: "Hash Expediente (SHA-256)" }, { h: "Hash Original" }, { h: "Match" }
          ]} rows={[
            ["DNI", "a1b2c3d4e5...f6g7", "a1b2c3d4e5...f6g7", <span style={{ color: C.green, fontWeight: 700 }}>✓ MATCH</span>],
            ["Título Profesional", "h8i9j0k1l2...m3n4", "h8i9j0k1l2...m3n4", <span style={{ color: C.green, fontWeight: 700 }}>✓ MATCH</span>],
            ["Cert. Trabajo", "o5p6q7r8s9...t0u1", "x9y8z7w6v5...u4t3", <span style={{ color: C.red, fontWeight: 700 }}>✗ NO MATCH</span>],
          ]} />
          <div style={{ marginTop: 16, display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <Btn color={C.red}>❌ Documentos Inválidos</Btn>
            <Btn color={C.green}>✓ Documentos Válidos</Btn>
          </div>
        </>
      );

    case "M10-LOG":
      return (
        <>
          <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
            <Field label="" type="select" ph="Convocatoria: TODAS" />
            <Field label="" ph="Desde: dd/mm/yyyy" />
            <Field label="" ph="Hasta: dd/mm/yyyy" />
            <Btn color={C.blue} sm>🔍 Filtrar</Btn>
            <Btn color={C.green} sm>📥 Export Excel</Btn>
          </div>
          <Table cols={[
            { h: "Fecha" }, { h: "Usuario" }, { h: "Entidad" }, { h: "Acción" },
            { h: "Estado Ant." }, { h: "Estado Nuevo" }, { h: "IP" }
          ]} rows={[
            ["2026-02-18 10:23", "jflores", "POSTULACION", "CAMBIO_ESTADO", <Badge color={C.gold}>REGISTRADO</Badge>, <Badge color={C.green}>INSCRITO</Badge>, "192.168.1.45"],
            ["2026-02-18 09:45", "admin", "CONVOCATORIA", "PUBLICAR", <Badge color={C.gold}>EN_ELABORACION</Badge>, <Badge color={C.green}>PUBLICADA</Badge>, "10.0.0.1"],
            ["2026-02-17 16:30", "mlopez", "PERFIL", "APROBAR", <Badge color={C.gold}>PENDIENTE</Badge>, <Badge color={C.green}>APROBADO</Badge>, "192.168.1.22"],
          ]} />
        </>
      );

    case "M02-FACT":
      return (
        <>
          <Alert type="info">Defina factores de evaluación por etapa. Deben ser consistentes con los pesos del Motor RF-14.</Alert>
          <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
            <Btn color={C.green} sm>+ Agregar Factor</Btn>
            <Field label="" type="select" ph="Etapa: TODAS" />
          </div>
          <Table cols={[
            { h: "#", w: "35px" }, { h: "Etapa" }, { h: "Criterio", w: "1.5fr" }, { h: "Ptje. Máx" },
            { h: "Ptje. Mín" }, { h: "Peso (%)" }, { h: "Orden", w: "50px" }, { h: "Acciones", w: "70px" }
          ]} rows={[
            ["1", <Badge color={C.green}>CURRICULAR</Badge>, "Formación académica", "30", "15", "30%", "1", "✏️ 🗑"],
            ["2", <Badge color={C.green}>CURRICULAR</Badge>, "Experiencia laboral", "40", "20", "40%", "2", "✏️ 🗑"],
            ["3", <Badge color={C.green}>CURRICULAR</Badge>, "Capacitación", "30", "10", "30%", "3", "✏️ 🗑"],
            ["4", <Badge color={C.blue}>TECNICA</Badge>, "Conocimiento técnico", "50", "25", "50%", "1", "✏️ 🗑"],
            ["5", <Badge color={C.blue}>TECNICA</Badge>, "Caso práctico", "50", "25", "50%", "2", "✏️ 🗑"],
            ["6", <Badge color={C.orange}>ENTREVISTA</Badge>, "Competencias", "50", "25", "50%", "1", "✏️ 🗑"],
            ["7", <Badge color={C.orange}>ENTREVISTA</Badge>, "Motivación y ajuste", "50", "20", "50%", "2", "✏️ 🗑"],
          ]} />
        </>
      );

    case "M02-ACTA":
      return (
        <>
          <Alert type="info">Paso 1: Genere el acta PDF. Paso 2: Descargue, imprima, firme. Paso 3: Escanee y cargue la versión firmada.</Alert>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div style={{ background: C.g50, border: `1px solid ${C.g200}`, borderRadius: 10, padding: 16, textAlign: "center" }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>📄</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.navy }}>Paso 1: Generar Acta PDF</div>
              <div style={{ fontSize: 10, color: C.g400, margin: "6px 0 12px" }}>JasperReports genera el acta con datos del comité, resolución y factores de evaluación</div>
              <Btn color={C.blue}>📄 Generar Acta de Instalación (E13)</Btn>
              <div style={{ marginTop: 8, fontSize: 10, color: C.g400 }}>Estado: <Badge color={C.green}>GENERADA</Badge></div>
            </div>
            <div style={{ background: C.g50, border: `1px solid ${C.g200}`, borderRadius: 10, padding: 16, textAlign: "center" }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>📤</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.navy }}>Paso 2: Cargar Acta Firmada</div>
              <div style={{ fontSize: 10, color: C.g400, margin: "6px 0 12px" }}>Suba el acta escaneada con firmas (multipart/form-data)</div>
              <div style={{ border: `2px dashed ${C.g300}`, borderRadius: 8, padding: 20, marginBottom: 8, cursor: "pointer" }}>
                <div style={{ fontSize: 20 }}>📎</div>
                <div style={{ fontSize: 10, color: C.g400 }}>Arrastre archivo aquí o haga clic</div>
                <div style={{ fontSize: 9, color: C.g300 }}>PDF / JPG / PNG — Máx. 10MB</div>
              </div>
              <Btn color={C.green}>📤 Cargar Acta Firmada (E14)</Btn>
            </div>
          </div>
        </>
      );

    case "M02-PUB":
      return (
        <>
          <Alert type="warn">La publicación debe ser <strong>SIMULTÁNEA</strong> en Portal ACFFAA y Talento Perú (D.S. 065-2011-PCM). Mínimo 10 días hábiles.</Alert>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.navy, marginBottom: 8 }}>Checklist de publicación:</div>
          {[
            { text: "Cronograma registrado y completo", ok: true },
            { text: "Comité de selección registrado", ok: true },
            { text: "Factores de evaluación configurados", ok: true },
            { text: "Acta de instalación firmada y cargada", ok: true },
            { text: "Bases PDF generadas", ok: true },
          ].map((c, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0", borderBottom: `1px solid ${C.g100}` }}>
              <div style={{ width: 16, height: 16, borderRadius: 3, background: c.ok ? C.green : C.g200, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: C.white }}>✓</div>
              <span style={{ fontSize: 11, color: C.g700 }}>{c.text}</span>
            </div>
          ))}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 14 }}>
            <Field label="Link Portal ACFFAA" req ph="https://www.acffaa.gob.pe/convocatorias/..." />
            <Field label="Link Talento Perú (SERVIR)" req ph="https://talentoperu.servir.gob.pe/..." />
          </div>
          <div style={{ marginTop: 16, display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <Btn color={C.blue} outline>📄 Generar Bases PDF (E16)</Btn>
            <Btn color={C.green}>✓ Aprobar y Publicar (E15)</Btn>
          </div>
        </>
      );

    case "M03-EXP":
      return (
        <>
          <Alert type="info">Cargue los documentos de su expediente virtual. Cada archivo recibirá un hash SHA-256 para verificación posterior en Etapa 4.</Alert>
          <div style={{ border: `2px dashed ${C.blue}40`, borderRadius: 10, padding: 24, textAlign: "center", background: `${C.blue}05`, marginBottom: 16 }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>📎</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.navy }}>Arrastre sus documentos aquí o haga clic para seleccionar</div>
            <div style={{ fontSize: 10, color: C.g400, marginTop: 4 }}>Formatos: PDF, JPG, PNG — Máximo 5MB por archivo</div>
          </div>
          <Table cols={[
            { h: "#", w: "35px" }, { h: "Documento" }, { h: "Archivo" }, { h: "Tamaño" },
            { h: "Hash SHA-256" }, { h: "Estado" }, { h: "🗑", w: "40px" }
          ]} rows={[
            ["1", "DNI", "dni_anverso.pdf", "245 KB", <span style={{ fontFamily: "monospace", fontSize: 9 }}>a1b2c3d4...</span>, <Badge color={C.green}>Cargado</Badge>, "🗑"],
            ["2", "Título Profesional", "titulo_unmsm.pdf", "1.2 MB", <span style={{ fontFamily: "monospace", fontSize: 9 }}>e5f6g7h8...</span>, <Badge color={C.green}>Cargado</Badge>, "🗑"],
            ["3", "Certificado Trabajo", "cert_trabajo_01.pdf", "380 KB", <span style={{ fontFamily: "monospace", fontSize: 9 }}>i9j0k1l2...</span>, <Badge color={C.green}>Cargado</Badge>, "🗑"],
            ["4", "Constancia CONAFOVICER", "—", "—", "—", <Badge color={C.gold}>Pendiente</Badge>, "—"],
          ]} />
          <div style={{ marginTop: 12, display: "flex", justifyContent: "flex-end" }}><Btn color={C.orange}>💾 Guardar Expediente (E18)</Btn></div>
        </>
      );

    case "M03-DL":
      return (
        <>
          <Alert type="warn">Checklist obligatorio D.L. 1451 — Verificación de antecedentes antes de continuar al filtro de requisitos mínimos RF-07.</Alert>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            {[
              { name: "RNSSC — Registro Nacional de Sanciones de Destitución y Despido", icon: "🔍", status: "APROBADO" },
              { name: "REGIPREC — Registro de Proveedores con Inhabilitación", icon: "🔍", status: "APROBADO" },
            ].map((v, i) => (
              <div key={i} style={{ background: C.g50, border: `1px solid ${C.g200}`, borderRadius: 10, padding: 14 }}>
                <div style={{ fontSize: 20, marginBottom: 6 }}>{v.icon}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.navy, marginBottom: 4 }}>{v.name}</div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <Badge color={v.status === "APROBADO" ? C.green : C.red}>{v.status}</Badge>
                  <span style={{ fontSize: 10, color: C.g400 }}>Verificado: 18/02/2026 10:23</span>
                </div>
              </div>
            ))}
          </div>
          <Field label="Observaciones D.L. 1451" type="textarea" ph="Resultado de la verificación automática..." />
          <div style={{ marginTop: 12, display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <Btn color={C.red}>❌ Marcar NO APTO</Btn>
            <Btn color={C.green}>✓ Verificación Aprobada (E19)</Btn>
          </div>
        </>
      );

    case "M03-FILTRO":
      return (
        <>
          <Alert type="info">Motor RF-07: Filtro automático de requisitos mínimos. Compara perfil atómico RPE 065-2020 vs datos de cada postulante.</Alert>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <Btn color={C.blue}>⚡ Ejecutar Filtro RF-07 (E20)</Btn>
          </div>
          <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            {[
              { label: "Total Postulantes", val: "15", color: C.blue },
              { label: "Aptos (INSCRITO)", val: "11", color: C.green },
              { label: "No Aptos", val: "4", color: C.red },
            ].map((s, i) => (
              <div key={i} style={{ flex: 1, background: `${s.color}08`, border: `1px solid ${s.color}25`, borderRadius: 8, padding: 12, textAlign: "center" }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.val}</div>
                <div style={{ fontSize: 10, color: C.g500 }}>{s.label}</div>
              </div>
            ))}
          </div>
          <Table cols={[
            { h: "#", w: "35px" }, { h: "Postulante" }, { h: "Formación" }, { h: "Exp. General" },
            { h: "Exp. Específica" }, { h: "Capacitación" }, { h: "Resultado" }
          ]} rows={[
            ["1", "López García, María", <span style={{ color: C.green }}>✓</span>, <span style={{ color: C.green }}>✓</span>, <span style={{ color: C.green }}>✓</span>, <span style={{ color: C.green }}>✓</span>, <Badge color={C.green}>INSCRITO</Badge>],
            ["2", "Torres Quispe, Juan", <span style={{ color: C.green }}>✓</span>, <span style={{ color: C.green }}>✓</span>, <span style={{ color: C.green }}>✓</span>, <span style={{ color: C.green }}>✓</span>, <Badge color={C.green}>INSCRITO</Badge>],
            ["3", "Mendoza Ruiz, Ana", <span style={{ color: C.green }}>✓</span>, <span style={{ color: C.red }}>✗</span>, <span style={{ color: C.green }}>✓</span>, <span style={{ color: C.green }}>✓</span>, <Badge color={C.red}>NO_APTO</Badge>],
            ["4", "Vargas Flores, Pedro", <span style={{ color: C.red }}>✗</span>, <span style={{ color: C.green }}>✓</span>, <span style={{ color: C.red }}>✗</span>, <span style={{ color: C.green }}>✓</span>, <Badge color={C.red}>NO_APTO</Badge>],
          ]} />
        </>
      );

    case "M03-TACHA":
      return (
        <>
          <Alert type="warn">Período de tachas: <strong>24 horas</strong> (RF-12). Las tachas deben ser resueltas dentro del plazo establecido.</Alert>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <div style={{ background: `${C.red}10`, border: `1px solid ${C.red}30`, borderRadius: 8, padding: "8px 14px", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 16 }}>⏱</span>
              <div><div style={{ fontSize: 10, color: C.g500 }}>Tiempo restante</div><div style={{ fontSize: 14, fontWeight: 800, color: C.red }}>18h 32m 15s</div></div>
            </div>
            <Btn color={C.orange} sm>+ Registrar Tacha (E21)</Btn>
          </div>
          <Table cols={[
            { h: "#", w: "35px" }, { h: "Postulante Tachado" }, { h: "Motivo", w: "1.5fr" }, { h: "Registrado por" },
            { h: "Fecha" }, { h: "Estado" }, { h: "Resolución" }
          ]} rows={[
            ["1", "Torres Quispe, Juan", "Documento de experiencia no coincide con declaración jurada", "López García, María", "18/02/2026 08:15", <Badge color={C.gold}>PENDIENTE</Badge>, <Btn sm color={C.blue}>Resolver (E22)</Btn>],
            ["2", "Vargas Flores, Pedro", "No cumple requisito de colegiatura obligatoria", "Anónimo", "18/02/2026 10:30", <Badge color={C.red}>FUNDADA</Badge>, <span style={{ fontSize: 10, color: C.red }}>→ DESCALIFICADO</span>],
          ]} />
        </>
      );

    case "M03-LISTA":
      return (
        <>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <div style={{ flex: 1, border: `1px solid ${C.g300}`, borderRadius: 6, padding: "6px 10px", fontSize: 11, color: C.g400 }}>🔍 Buscar por nombre o código...</div>
            <Field label="" type="select" ph="Estado: TODOS" />
            <Btn color={C.green} sm>📥 Export Excel</Btn>
            <Btn color={C.red} sm>📄 Export PDF</Btn>
          </div>
          <Table cols={[
            { h: "#", w: "35px" }, { h: "Código" }, { h: "Nombre" }, { h: "DNI" },
            { h: "Estado Statechart" }, { h: "Ptje. Parcial" }, { h: "Acciones", w: "80px" }
          ]} rows={[
            ["1", "ANON-1024", "López García, María Elena", "45678912", <Badge color={C.green}>APTO</Badge>, "85.5", "👁 ✏️"],
            ["2", "ANON-1025", "Torres Quispe, Juan Carlos", "32145678", <Badge color={C.green}>APTO</Badge>, "72.0", "👁 ✏️"],
            ["3", "ANON-1026", "Sánchez Vega, Rosa María", "78912345", <Badge color={C.green}>INSCRITO</Badge>, "—", "👁 ✏️"],
            ["4", "—", "Mendoza Ruiz, Ana Lucía", "65432198", <Badge color={C.red}>NO_APTO</Badge>, "45.0", "👁"],
            ["5", "—", "Vargas Flores, Pedro Luis", "98765432", <Badge color={C.red}>DESCALIFICADO</Badge>, "—", "👁"],
          ]} />
        </>
      );

    case "M03-CURR":
      return (
        <>
          <Alert type="info">Evaluación Curricular RF-09 — Evalúe cada postulante INSCRITO según los criterios configurados. Si puntaje total ≥ umbral (60 pts) → APTO.</Alert>
          <div style={{ background: C.g50, border: `1px solid ${C.g200}`, borderRadius: 10, padding: 14, marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.navy, marginBottom: 6 }}>Evaluando: López García, María Elena — ANON-1024</div>
            <Table cols={[
              { h: "Criterio", w: "1.5fr" }, { h: "Ptje. Máximo" }, { h: "Ptje. Mínimo" }, { h: "Puntaje Asignado" }, { h: "Peso" }
            ]} rows={[
              ["Formación académica", "30", "15", <Field label="" ph="28" />, "30%"],
              ["Experiencia laboral", "40", "20", <Field label="" ph="35" />, "40%"],
              ["Capacitación y cursos", "30", "10", <Field label="" ph="22" />, "30%"],
            ]} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, padding: "8px 10px", background: C.white, borderRadius: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: C.navy }}>Total: <span style={{ color: C.green, fontSize: 16 }}>85</span> / 100</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.green }}>≥ 60 pts → APTO ✓</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <Btn color={C.g500} outline>← Anterior</Btn>
            <Btn color={C.blue}>💾 Guardar Evaluación (E24)</Btn>
            <Btn color={C.green}>Siguiente →</Btn>
          </div>
        </>
      );

    case "M03-COD":
      return (
        <>
          <Alert type="warn">Asignación de códigos anónimos RF-10 — Una vez asignados, el Comité de Selección <strong>NUNCA</strong> verá nombres ni datos personales (D.L. 1451).</Alert>
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            <Btn color={C.orange}>🔐 Asignar Códigos Anónimos (E25)</Btn>
            <span style={{ fontSize: 10, color: C.g400, display: "flex", alignItems: "center" }}>Secuencia: SEQ_CODIGO_ANONIMO</span>
          </div>
          <Table cols={[
            { h: "#", w: "35px" }, { h: "Postulante (solo visible ORH)" }, { h: "DNI (solo ORH)" },
            { h: "Código Anónimo Asignado" }, { h: "Estado" }
          ]} rows={[
            ["1", "López García, María Elena", "45678912", <strong style={{ color: C.orange, fontSize: 13 }}>ANON-1024</strong>, <Badge color={C.green}>Asignado</Badge>],
            ["2", "Torres Quispe, Juan Carlos", "32145678", <strong style={{ color: C.orange, fontSize: 13 }}>ANON-1025</strong>, <Badge color={C.green}>Asignado</Badge>],
            ["3", "Sánchez Vega, Rosa María", "78912345", <strong style={{ color: C.orange, fontSize: 13 }}>ANON-1026</strong>, <Badge color={C.green}>Asignado</Badge>],
          ]} />
          <Alert type="info">A partir de este momento, la vista del Comité solo mostrará los códigos ANON-XXXX. Los nombres quedan ocultos hasta la publicación de resultados finales.</Alert>
        </>
      );

    case "M03-ENT":
      return (
        <>
          <Alert type="info">Entrevista Personal RF-13 — Cada miembro del comité asigna puntaje. Se verifica quórum automáticamente. Si falta miembro, registre reemplazante.</Alert>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
            <Field label="Fecha Entrevista" req value="24/02/2026" />
            <Field label="Hora" req value="09:00" />
            <Field label="Lugar" req value="Sala 3er piso - ACFFAA" />
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.navy, marginBottom: 6 }}>Puntajes por miembro — Postulante: ANON-1024</div>
          <Table cols={[
            { h: "Criterio", w: "1.3fr" }, { h: "Presidente" }, { h: "Secretario" }, { h: "Vocal" }, { h: "Promedio" }
          ]} rows={[
            ["Competencias profesionales", "45", "42", "48", <strong>45.0</strong>],
            ["Motivación y ajuste al puesto", "40", "38", "44", <strong>40.7</strong>],
          ]} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10, padding: "8px 10px", background: C.g50, borderRadius: 6 }}>
            <span style={{ fontSize: 11, color: C.g500 }}>Quórum: <strong style={{ color: C.green }}>3/3 ✓</strong></span>
            <span style={{ fontSize: 12, fontWeight: 700, color: C.navy }}>Total Entrevista: <strong style={{ color: C.green }}>85.7</strong> / 100</span>
          </div>
          <div style={{ marginTop: 12, display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <Btn color={C.gold} outline sm>👤 Registrar Reemplazante</Btn>
            <Btn color={C.blue}>💾 Guardar Entrevista (E27)</Btn>
          </div>
        </>
      );

    case "M03-BONIF":
      return (
        <>
          <Alert type="info">Motor RF-15 — Bonificaciones legales aplicadas automáticamente según declaración jurada del postulante. Cálculo: bonificación = puntaje_final × porcentaje.</Alert>
          <Table cols={[
            { h: "Código" }, { h: "Ptje. Final" }, { h: "FF.AA. 10%\n(Ley 29248)" }, { h: "Discapacidad 15%\n(Ley 29973)" },
            { h: "Deportistas 5%\n(Ley 27674)" }, { h: "Bonif. Total" }, { h: "Ptje. + Bonif." }
          ]} rows={[
            [<strong style={{ color: C.orange }}>ANON-1024</strong>, "86.27", <span style={{ color: C.green }}>✓ +8.63</span>, "—", "—", <strong style={{ color: C.green }}>+8.63</strong>, <strong style={{ color: C.green }}>94.90</strong>],
            [<strong style={{ color: C.orange }}>ANON-1025</strong>, "74.35", "—", "—", "—", "0.00", "74.35"],
            [<strong style={{ color: C.orange }}>ANON-1027</strong>, "67.15", "—", <span style={{ color: C.green }}>✓ +10.07</span>, "—", <strong style={{ color: C.green }}>+10.07</strong>, <strong style={{ color: C.green }}>77.22</strong>],
          ]} />
          <div style={{ marginTop: 12, display: "flex", justifyContent: "flex-end" }}><Btn color={C.blue}>⚡ Aplicar Bonificaciones (E28)</Btn></div>
        </>
      );

    case "M03-RESULT":
      return (
        <>
          <Alert type="success">Publicación de Resultados Finales — Se notificará a TODOS los postulantes (ganador, accesitarios, no aptos) y se registrará en el Log de Transparencia (RF-18).</Alert>
          <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            {[
              { label: "Ganador", val: "ANON-1024", color: C.green },
              { label: "Accesitarios", val: "2", color: C.blue },
              { label: "No Aptos", val: "4", color: C.red },
              { label: "Total Postulantes", val: "15", color: C.g500 },
            ].map((s, i) => (
              <div key={i} style={{ flex: 1, background: `${s.color}08`, border: `1px solid ${s.color}25`, borderRadius: 8, padding: 10, textAlign: "center" }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: s.color }}>{s.val}</div>
                <div style={{ fontSize: 10, color: C.g500 }}>{s.label}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.navy, marginBottom: 6 }}>Checklist pre-publicación:</div>
          {["Actas de evaluación generadas", "Cuadro de méritos aprobado", "Bonificaciones aplicadas"].map((c, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0" }}>
              <div style={{ width: 15, height: 15, borderRadius: 3, background: C.green, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: C.white }}>✓</div>
              <span style={{ fontSize: 11, color: C.g700 }}>{c}</span>
            </div>
          ))}
          <div style={{ marginTop: 14, display: "flex", justifyContent: "flex-end" }}><Btn color={C.green}>📢 Publicar Resultados Finales (E31)</Btn></div>
        </>
      );

    case "M04-NOTIF":
      return (
        <>
          <Alert type="info">Notifique al ganador para que presente documentos originales dentro del plazo establecido. Si no presenta, convoque al accesitario.</Alert>
          <div style={{ background: `${C.green}08`, border: `1px solid ${C.green}25`, borderRadius: 10, padding: 14, marginBottom: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: C.green, marginBottom: 4 }}>🏆 GANADOR — Posición 1°</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <Field label="Nombre" value="López García, María Elena" />
              <Field label="DNI" value="45678912" />
              <Field label="Puntaje Final" value="94.90 pts" />
              <Field label="Email" value="mlopez@email.com" />
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <div style={{ background: `${C.gold}10`, border: `1px solid ${C.gold}30`, borderRadius: 8, padding: "8px 14px", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 16 }}>⏱</span>
              <div><div style={{ fontSize: 10, color: C.g500 }}>Plazo para presentar documentos</div><div style={{ fontSize: 14, fontWeight: 800, color: C.gold }}>5 días hábiles</div></div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <Btn color={C.blue}>📧 Notificar Ganador (E32)</Btn>
          </div>
        </>
      );

    case "M04-CONT":
      return (
        <>
          <Alert type="success">Suscripción del Contrato CAS — D.Leg. 1057. Firma bilateral entre la entidad y el ganador.</Alert>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Field label="N° Contrato" value="CONT-CAS-2026-001 (autogenerado)" />
            <Field label="Convocatoria" value="CAS N° 001-2026-ACFFAA" />
            <Field label="Contratado" value="López García, María Elena" />
            <Field label="DNI" value="45678912" />
            <Field label="Fecha Inicio" req ph="01/03/2026" />
            <Field label="Fecha Fin" req ph="30/06/2026" />
            <Field label="Monto Mensual" req value="S/ 9,000.00" />
            <Field label="Dependencia" value="OGITD — Oficina General de Tecnologías" />
            <Field label="Funciones" type="textarea" span2 ph="(Heredadas del Perfil del Puesto) 1. Brindar asesoramiento técnico legal... 2. Elaborar informes..." />
            <Field label="Horario" value="09:00 — 17:30" />
            <Field label="Lugar de Prestación" value="Jr. Arequipa 123, Cercado de Lima" />
          </div>
          <div style={{ marginTop: 16, display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <Btn color={C.g500} outline>📋 Guardar Borrador</Btn>
            <Btn color={C.green}>✍️ Suscribir Contrato (E34)</Btn>
          </div>
        </>
      );

    case "M04-ACCES":
      return (
        <>
          <Alert type="warn">El ganador no presentó documentos o rechazó el puesto. Convoque al siguiente accesitario según orden de mérito.</Alert>
          <Table cols={[
            { h: "Posición" }, { h: "Código" }, { h: "Nombre" }, { h: "Puntaje Final" }, { h: "Estado" }, { h: "Acción" }
          ]} rows={[
            [<strong style={{ color: C.gold }}>1°</strong>, "ANON-1024", "López García, María Elena", "94.90", <Badge color={C.red}>RECHAZÓ</Badge>, <span style={{ color: C.g400, fontSize: 10 }}>—</span>],
            [<strong style={{ color: C.blue }}>2°</strong>, "ANON-1027", "Sánchez Vega, Rosa María", "77.22", <Badge color={C.gold}>PENDIENTE</Badge>, <Btn sm color={C.blue}>📧 Convocar (E35)</Btn>],
            [<strong style={{ color: C.blue }}>3°</strong>, "ANON-1025", "Torres Quispe, Juan Carlos", "74.35", <Badge color={C.g400}>EN ESPERA</Badge>, <span style={{ color: C.g400, fontSize: 10 }}>—</span>],
          ]} />
          <div style={{ marginTop: 16, display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <Btn color={C.red}>🚫 Declarar Proceso DESIERTO (E37)</Btn>
          </div>
        </>
      );

    case "M04-PLAN":
      return (
        <>
          <Alert type="warn">Registro en planilla electrónica dentro de los <strong>5 días hábiles</strong> posteriores a la suscripción del contrato (D.S. 018-2007-TR).</Alert>
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            <div style={{ background: `${C.gold}10`, border: `1px solid ${C.gold}30`, borderRadius: 8, padding: "8px 14px", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 16 }}>⏱</span>
              <div><div style={{ fontSize: 10, color: C.g500 }}>Plazo restante</div><div style={{ fontSize: 14, fontWeight: 800, color: C.gold }}>3 días hábiles</div></div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Field label="N° Contrato" value="CONT-CAS-2026-001" />
            <Field label="Contratado" value="López García, María Elena" />
            <Field label="N° Registro Planilla" req ph="Ingrese número de registro" />
            <Field label="Fecha Registro" req ph="dd/mm/yyyy" />
            <Field label="Sistema" type="select" req ph="T-Registro / PLAME" />
            <Field label="Observaciones" type="textarea" ph="..." />
          </div>
          <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}><Btn color={C.blue}>💾 Registrar en Planilla (E36)</Btn></div>
        </>
      );

    case "M04-CLOSE":
      return (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            {[
              { label: "Convocatoria", val: "CAS N° 001-2026-ACFFAA" },
              { label: "Resultado", val: "FINALIZADO" },
              { label: "Ganador", val: "López García, María Elena" },
              { label: "Contrato", val: "CONT-CAS-2026-001" },
              { label: "Planilla", val: "Registrada el 05/03/2026" },
              { label: "Duración Proceso", val: "35 días calendarios" },
            ].map((d, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${C.g100}` }}>
                <span style={{ fontSize: 11, color: C.g500 }}>{d.label}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: C.navy }}>{d.val}</span>
              </div>
            ))}
          </div>
          <Alert type="success">Al cerrar el proceso, el estado será <strong>FINALIZADO</strong> (inmutable) y se registrará en el Log de Transparencia RF-18.</Alert>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <Btn color={C.blue} outline>📄 Generar Reporte de Cierre PDF</Btn>
            <Btn color={C.green}>🔒 Cerrar Proceso (E37)</Btn>
          </div>
        </>
      );

    case "M10-CAT":
      return (
        <>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <Field label="" type="select" ph="Catálogo: TIPO_DOC" />
            <Btn color={C.green} sm>+ Agregar Valor</Btn>
          </div>
          <Table cols={[
            { h: "#", w: "35px" }, { h: "Código", w: "100px" }, { h: "Descripción", w: "1.5fr" },
            { h: "Estado" }, { h: "Acciones", w: "80px" }
          ]} rows={[
            ["1", "DNI", "Documento Nacional de Identidad", <Badge color={C.green}>Activo</Badge>, "✏️ 🗑"],
            ["2", "CE", "Carné de Extranjería", <Badge color={C.green}>Activo</Badge>, "✏️ 🗑"],
            ["3", "PAS", "Pasaporte", <Badge color={C.green}>Activo</Badge>, "✏️ 🗑"],
            ["4", "PTP", "Permiso Temporal de Permanencia", <Badge color={C.g400}>Inactivo</Badge>, "✏️ 🗑"],
          ]} />
          <div style={{ marginTop: 10, fontSize: 10, color: C.g400 }}>Catálogos disponibles: TIPO_DOC, NIVEL_FORMACION, TIPO_CONTRATO, MOTIVO_REQUERIMIENTO, ESTADO_CONVOCATORIA, ESTADO_POSTULACION</div>
        </>
      );

    case "M10-AREAS":
      return (
        <>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <div style={{ flex: 1, border: `1px solid ${C.g300}`, borderRadius: 6, padding: "6px 10px", fontSize: 11, color: C.g400 }}>🔍 Buscar área...</div>
            <Btn color={C.green} sm>+ Agregar Área</Btn>
          </div>
          <Table cols={[
            { h: "#", w: "35px" }, { h: "Código" }, { h: "Nombre del Área", w: "2fr" },
            { h: "Sigla" }, { h: "Estado" }, { h: "Acciones", w: "70px" }
          ]} rows={[
            ["1", "001", "Dirección General", "DG", <Badge color={C.green}>Activo</Badge>, "✏️"],
            ["2", "002", "Oficina de Recursos Humanos", "ORH", <Badge color={C.green}>Activo</Badge>, "✏️"],
            ["3", "003", "Oficina General de Tecnologías, Innovación y Transformación Digital", "OGITD", <Badge color={C.green}>Activo</Badge>, "✏️"],
            ["4", "004", "Oficina de Planeamiento y Presupuesto", "OPP", <Badge color={C.green}>Activo</Badge>, "✏️"],
          ]} />
        </>
      );

    case "M10-USERS":
      return (
        <>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <div style={{ flex: 1, border: `1px solid ${C.g300}`, borderRadius: 6, padding: "6px 10px", fontSize: 11, color: C.g400 }}>🔍 Buscar usuario...</div>
            <Btn color={C.green} sm>+ Nuevo Usuario</Btn>
          </div>
          <Table cols={[
            { h: "#", w: "35px" }, { h: "Username" }, { h: "Nombre Completo" }, { h: "Email" },
            { h: "Roles" }, { h: "Estado" }, { h: "Última Conexión" }, { h: "Acciones", w: "70px" }
          ]} rows={[
            ["1", "jflores", "Flores Quispe, Juan", "jflores@acffaa.gob.pe", <><Badge color={C.blue}>ORH</Badge> <Badge color={C.red}>ADMIN</Badge></>, <Badge color={C.green}>Activo</Badge>, "18/02/2026 10:23", "✏️"],
            ["2", "mlopez", "López Díaz, María", "mlopez@acffaa.gob.pe", <Badge color={C.green}>OPP</Badge>, <Badge color={C.green}>Activo</Badge>, "17/02/2026 16:45", "✏️"],
            ["3", "atorres", "Torres Vega, Ana", "atorres@acffaa.gob.pe", <Badge color={C.orange}>COMITE</Badge>, <Badge color={C.green}>Activo</Badge>, "18/02/2026 08:30", "✏️"],
            ["4", "pvargas", "Vargas Soto, Pedro", "pvargas@acffaa.gob.pe", <Badge color={C.gold}>AREA_SOL</Badge>, <Badge color={C.g400}>Inactivo</Badge>, "10/01/2026 14:00", "✏️"],
          ]} />
        </>
      );

    case "M10-NOTIF":
      return (
        <>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <Field label="" type="select" ph="Filtro: Todas" />
            <Btn color={C.blue} sm>✓ Marcar todas como leídas</Btn>
          </div>
          <Table cols={[
            { h: "", w: "25px" }, { h: "Fecha" }, { h: "Tipo" }, { h: "Mensaje", w: "2fr" }, { h: "Leída" }
          ]} rows={[
            ["🔵", "18/02/2026 10:23", <Badge color={C.green}>Aprobación</Badge>, "El perfil 1404 ha sido APROBADO por ORH", <span style={{ color: C.green }}>✓</span>],
            ["🔴", "18/02/2026 09:15", <Badge color={C.blue}>Convocatoria</Badge>, "Nueva convocatoria CAS N° 001-2026-ACFFAA publicada", <span style={{ color: C.red, fontWeight: 700 }}>●</span>],
            ["🔴", "17/02/2026 16:30", <Badge color={C.orange}>Resultado</Badge>, "Resultados finales publicados para CAS N° 001-2026", <span style={{ color: C.red, fontWeight: 700 }}>●</span>],
            ["🔵", "17/02/2026 14:00", <Badge color={C.red}>Rechazo</Badge>, "El perfil 1445 ha sido RECHAZADO — No cumple MPP", <span style={{ color: C.green }}>✓</span>],
          ]} />
        </>
      );

    default:
      return null;
  }
};

/* ═══════ MAIN APP ═══════ */
export default function App() {
  const [activeId, setActiveId] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [view, setView] = useState("proto");

  const allScreens = MODULES.flatMap(m => m.screens.map(s => ({ ...s, mod: m.key, modName: m.name, modIcon: m.icon, modColor: m.color })));
  const active = allScreens.find(s => s.id === activeId);
  const totalEps = new Set(allScreens.flatMap(s => s.eps)).size;
  const sw = collapsed ? 56 : 240;

  return (
    <div style={{ fontFamily: "'Segoe UI', -apple-system, sans-serif", background: C.bg, minHeight: "100vh", display: "flex" }}>
      {/* SIDEBAR */}
      <div style={{ width: sw, background: `linear-gradient(180deg, ${C.navy} 0%, ${C.navyL} 100%)`, color: C.white, height: "100vh", position: "fixed", left: 0, top: 0, transition: "width 0.25s", overflowY: "auto", overflowX: "hidden", zIndex: 100, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: collapsed ? "14px 8px" : "16px 14px", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", gap: 8, minHeight: 52 }}>
          {!collapsed && <>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🏛️</div>
            <div><div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 0.5 }}>SISCONV</div><div style={{ fontSize: 8.5, color: C.gold, letterSpacing: 1.5 }}>ACFFAA </div></div>
          </>}
          <button onClick={() => setCollapsed(!collapsed)} style={{ marginLeft: "auto", background: "rgba(255,255,255,0.08)", border: "none", color: "rgba(255,255,255,0.6)", borderRadius: 6, width: 24, height: 24, cursor: "pointer", fontSize: 10 }}>{collapsed ? "▸" : "◂"}</button>
        </div>

        {MODULES.map(mod => {
          const isActiveMod = active?.mod === mod.key;
          return (
            <div key={mod.key}>
              <div style={{ padding: collapsed ? "8px 6px" : "9px 14px", fontSize: 10, fontWeight: 800, color: isActiveMod ? mod.color : "rgba(255,255,255,0.35)", letterSpacing: 1.2, textTransform: "uppercase", display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                <span style={{ fontSize: 14 }}>{mod.icon}</span>
                {!collapsed && <span>{mod.key}</span>}
                {!collapsed && <span style={{ marginLeft: "auto", fontSize: 9, background: "rgba(255,255,255,0.06)", padding: "1px 5px", borderRadius: 8 }}>{mod.screens.length}</span>}
              </div>
              {!collapsed && mod.screens.map(s => (
                <div key={s.id} onClick={() => { setActiveId(s.id); setView("proto"); }}
                  style={{
                    padding: "6px 14px 6px 36px", fontSize: 10.5, cursor: "pointer", transition: "all 0.15s",
                    color: activeId === s.id ? C.white : "rgba(255,255,255,0.55)",
                    background: activeId === s.id ? `${mod.color}25` : "transparent",
                    borderLeft: activeId === s.id ? `3px solid ${mod.color}` : "3px solid transparent",
                  }}>
                  {s.name}
                </div>
              ))}
            </div>
          );
        })}

        {!collapsed && (
          <div style={{ padding: "10px 14px", borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: "auto", fontSize: 9, color: "rgba(255,255,255,0.3)" }}>
            {allScreens.length} pantallas · {totalEps} endpoints · 6 módulos
          </div>
        )}
      </div>

      {/* MAIN */}
      <div style={{ marginLeft: sw, flex: 1, transition: "margin-left 0.25s" }}>
        {/* TOPBAR */}
        <div style={{ background: C.white, borderBottom: `1px solid ${C.g200}`, padding: "0 20px", height: 44, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
          <div style={{ display: "flex", gap: 2 }}>
            {[["proto", "🖥 Prototipos"], ["pdfs", "📄 PDFs"]].map(([k, l]) => (
              <button key={k} onClick={() => setView(k)} style={{ padding: "5px 12px", fontSize: 10.5, fontWeight: view === k ? 700 : 400, color: view === k ? C.blue : C.g400, background: view === k ? `${C.blue}08` : "transparent", border: "none", borderRadius: 5, cursor: "pointer" }}>{l}</button>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ position: "relative", fontSize: 14, cursor: "pointer" }}>🔔<span style={{ position: "absolute", top: -4, right: -4, width: 12, height: 12, borderRadius: "50%", background: C.red, fontSize: 7, color: C.white, display: "flex", alignItems: "center", justifyContent: "center" }}>3</span></span>
            <span style={{ width: 28, height: 28, borderRadius: "50%", background: C.blue, color: C.white, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700 }}>JF</span>
          </div>
        </div>

        <div style={{ padding: 20 }}>
          {view === "proto" && !active && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "70vh", color: C.g400 }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🖥️</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: C.navy, letterSpacing: -0.5 }}>SISCONV-ACFFAA</div>
              <div style={{ fontSize: 12, marginTop: 6, color: C.g400 }}>Selecciona una pantalla del menú lateral para ver su prototipo</div>
              <div style={{ display: "flex", gap: 12, marginTop: 20, flexWrap: "wrap", justifyContent: "center" }}>
                {MODULES.map(m => (
                  <div key={m.key} style={{ background: C.white, border: `1px solid ${C.g200}`, borderRadius: 10, padding: "12px 16px", textAlign: "center", width: 120 }}>
                    <div style={{ fontSize: 24 }}>{m.icon}</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: m.color, marginTop: 4 }}>{m.key}</div>
                    <div style={{ fontSize: 10, color: C.g400 }}>{m.name}</div>
                    <div style={{ fontSize: 9, color: C.g300, marginTop: 2 }}>{m.screens.length} pantallas</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {view === "proto" && active && (
            <div>
              <div style={{ fontSize: 10.5, color: C.g400, marginBottom: 6 }}>{active.modIcon} {active.modName} / {active.name}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: C.navy, margin: 0, letterSpacing: -0.3 }}>{active.name}</h2>
                <Badge color={active.modColor}>{active.id}</Badge>
              </div>
              <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
                {active.methods.map((m, i) => {
                  const method = m.split(" ")[0];
                  const mc = { GET: C.green, POST: C.blue, PUT: C.orange, DELETE: C.red }[method] || C.g500;
                  return <span key={i} style={{ fontSize: 9.5, fontFamily: "monospace", background: `${mc}12`, color: mc, padding: "3px 8px", borderRadius: 5, fontWeight: 600 }}>{m}</span>;
                })}
              </div>

              <div style={{ background: C.white, border: `1px solid ${C.g200}`, borderRadius: 10, overflow: "hidden" }}>
                <div style={{ padding: "10px 16px", borderBottom: `1px solid ${C.g100}`, display: "flex", justifyContent: "space-between", alignItems: "center", background: C.g50 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: C.navy }}>{active.name}</span>
                  <div style={{ display: "flex", gap: 4 }}>
                    {active.id !== "M05-LOGIN" && <><Btn sm color={C.g500} outline>Copiar</Btn><Btn sm color={C.g500} outline>CSV</Btn><Btn sm color={C.g500} outline>Imprimir</Btn></>}
                  </div>
                </div>
                <div style={{ padding: 16 }}><ScreenContent sid={active.id} /></div>
              </div>

              {JUST[active.id] && (
                <div style={{ marginTop: 14, padding: 14, background: `${active.modColor}06`, borderRadius: 10, border: `1px solid ${active.modColor}20` }}>
                  <div style={{ fontSize: 10.5, fontWeight: 800, color: active.modColor, marginBottom: 5 }}>📖 JUSTIFICACIÓN DEL PROTOTIPO — {active.id}</div>
                  <div style={{ fontSize: 11, color: C.g700, lineHeight: 1.65 }}>{JUST[active.id]}</div>
                </div>
              )}
            </div>
          )}

          {view === "pdfs" && (
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: C.navy, letterSpacing: -0.3 }}>📄 PDFs que genera SISCONV (8 documentos)</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}>
                {[
                  { name: "Perfil del Puesto", ep: "E5", mod: "M01", desc: "Identificación, Misión, Funciones, Formación, Conocimientos, Experiencia. JasperReports." },
                  { name: "Bases de Convocatoria", ep: "E16", mod: "M02", desc: "Bases completas: perfil, requisitos, cronograma, factores, bonificaciones, marco legal." },
                  { name: "Acta de Instalación", ep: "E13", mod: "M02", desc: "Datos del comité, resolución, factores de evaluación, firmas." },
                  { name: "Acta de Evaluación", ep: "E30", mod: "M03", desc: "Resultados por etapa (curricular, técnica, entrevista) por postulante." },
                  { name: "Cuadro de Méritos", ep: "E30", mod: "M03", desc: "Ranking final con puntajes ponderados, bonificaciones, posición." },
                  { name: "Resultados Finales", ep: "E31", mod: "M03", desc: "Publicación oficial: ganador, accesitarios, resultado del proceso." },
                  { name: "Contrato CAS", ep: "E34", mod: "M04", desc: "Contrato bilateral D.Leg. 1057 con datos del puesto y del contratado." },
                  { name: "Reporte de Cierre", ep: "E37", mod: "M04", desc: "Resumen ejecutivo del proceso: etapas, fechas, resultado final." },
                ].map((p, i) => (
                  <div key={i} style={{ background: C.white, border: `1px solid ${C.g200}`, borderRadius: 10, padding: 14 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 8, background: `${C.red}10`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>📄</div>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: C.navy }}>{p.name}</div>
                        <div style={{ fontSize: 9, color: C.g400, fontFamily: "monospace" }}>{p.ep} · {p.mod}</div>
                      </div>
                    </div>
                    <div style={{ fontSize: 10.5, color: C.g500, lineHeight: 1.5 }}>{p.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {view === "tools" && (
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: C.navy, letterSpacing: -0.3 }}>🛠 Herramientas recomendadas para prototipos</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}>
                {[
                  { name: "Figma", icon: "🎨", tier: "RECOMENDADO", desc: "Mejor opción gratuita. Prototipos interactivos con flujos navegables. Colaboración en tiempo real. Components reutilizables. Auto-layout. Export a código.", color: C.blue },
                  { name: "Balsamiq Wireframes", icon: "✏️", tier: "WIREFRAMES", desc: "Para baja fidelidad rápida. Ideal para validar flujos con stakeholders antes de diseñar en alta fidelidad. Estilo 'dibujado a mano' profesional.", color: C.g500 },
                  { name: "Adobe XD", icon: "🖌", tier: "ALTERNATIVA", desc: "Alternativa profesional a Figma. Prototipos interactivos, auto-animate, componentes. Plan gratuito disponible con limitaciones.", color: "#FF61F6" },
                  { name: "StarUML", icon: "⭐", tier: "DIAGRAMAS UML", desc: "Para los 28 diagramas de casos de uso. Soporte nativo UML 2.5. Export a imagen. Use los SVGs generados como referencia visual directa.", color: C.gold },
                  { name: "Lucidchart / draw.io", icon: "📐", tier: "BPMN + FLUJOS", desc: "Para diagramas BPMN y flujos. draw.io es gratuito. Compatible con los 4 diagramas de flujo BPMN de las etapas CAS.", color: C.green },
                  { name: "Angular 17+ CLI", icon: "🅰️", tier: "DESARROLLO", desc: "Stack de desarrollo definido en la Arquitectura v2. Standalone components, signals, reactive forms, Tailwind CSS, NgRx. Para implementar los prototipos.", color: C.red },
                ].map((t, i) => (
                  <div key={i} style={{ background: C.white, border: `1px solid ${C.g200}`, borderRadius: 10, padding: 14 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <div style={{ fontSize: 24 }}>{t.icon}</div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>{t.name}</div>
                        <Badge color={t.color}>{t.tier}</Badge>
                      </div>
                    </div>
                    <div style={{ fontSize: 10.5, color: C.g500, lineHeight: 1.5 }}>{t.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
