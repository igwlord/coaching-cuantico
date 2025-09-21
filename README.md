# Coaching Cuántico — Web (Vite + React + Tailwind)

Este proyecto replica exactamente el contenido de `model.md` en una app React creada con Vite y Tailwind CSS.

## Requisitos
- Node.js 18+

## Instalar dependencias
```powershell
npm install
```

## Modo desarrollo
```powershell
npm run dev
```
Abre la URL que muestre la terminal (por defecto http://localhost:5173).

## Build de producción
```powershell
npm run build
```

## Previsualización del build
```powershell
npm run preview -- --port 5174
```

## Deploy en Netlify

Esta app está lista para desplegarse en Netlify.

- Sitio: https://coaching-cuantico.netlify.app/
- Configuración incluida en `netlify.toml`:
	- build: `npm run build`
	- publish: `dist`
	- redirect SPA a `index.html`

### Conectar el repositorio
1. Asegúrate de que los cambios estén en la rama `main` del repo `igwlord/coaching-cuantico`.
2. En Netlify, crea un nuevo sitio desde Git, conecta tu cuenta de GitHub y selecciona el repo.
3. Netlify detectará automáticamente:
	 - Build command: `npm run build`
	 - Publish directory: `dist`
4. Despliega. Cualquier push a `main` disparará un deploy.

## Estructura
- `src/App.jsx`: Contenido fiel de `model.md`.
- `src/main.jsx`: Punto de entrada de React.
- `index.html`: Documento base de Vite.
- `tailwind.config.js` y `postcss.config.js`: Configuración de Tailwind.
- `src/index.css`: Estilos globales con directivas de Tailwind.

## Notas
- No se modificó el texto ni la lógica del archivo `model.md`; solo se integró en React/Vite para ejecutar la web.
- Tailwind se usa para las clases utilitarias presentes en el contenido.