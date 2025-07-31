# 📸 Instrucciones para usar imágenes de Google Drive

## 🎯 Eventos Actualizados

He actualizado estos dos eventos para usar imágenes de Google Drive:

1. **Ethereum Cali Opening** - Usará imagen de la carpeta 1
2. **Ethereans del Pacifico 1** - Usará imagen de la carpeta 2

## 📋 Pasos para convertir imágenes de Google Drive

### Paso 1: Hacer pública la imagen
1. Ve a Google Drive
2. Abre la imagen que quieres usar
3. Haz clic derecho → "Obtener enlace"
4. Cambia los permisos a "Cualquier persona con el enlace puede ver"
5. Copia el enlace

### Paso 2: Extraer el ID de la imagen
El enlace de Google Drive se ve así:
```
https://drive.google.com/file/d/1ABC123DEF456/view?usp=sharing
```

El ID es la parte entre `/d/` y `/view`:
```
1ABC123DEF456
```

### Paso 3: Crear la URL para la web
Usa este formato:
```
https://drive.google.com/uc?export=view&id=TU_ID_AQUI
```

## 🔄 Reemplazar en el código

Una vez que tengas los IDs, reemplaza en `events.html`:

### Para Ethereum Cali Opening:
```html
<img src="https://drive.google.com/uc?export=view&id=TU_ID_IMAGEN_1" alt="Ethereum cali Opening" class="event-image">
```

### Para Ethereans del Pacifico 1:
```html
<img src="https://drive.google.com/uc?export=view&id=TU_ID_IMAGEN_2" alt="Ethereans del Pacifico 1" class="event-image">
```

## 📁 Imágenes disponibles en las carpetas

### Carpeta 1: https://drive.google.com/drive/u/0/folders/1ttr-X9LXeOuObiJpKiq9AF0bNSCStZ-9
- camphoto_758783491.jpg
- IMG_8926.HEIC
- IMG_8927.HEIC
- IMG_8928.HEIC
- IMG_8929.HEIC
- IMG_8930.HEIC
- IMG_8931.HEIC
- IMG_8932.HEIC
- IMG_8934.HEIC
- IMG_8935.HEIC
- Screenshot 2025-07-17 at 11.36.44 PM.png
- Screenshot 2025-07-17 at 11.36.53 PM.png
- Screenshot 2025-07-17 at 11.37.02 PM.png

### Carpeta 2: https://drive.google.com/drive/folders/1I3lggk-xAUCt8edKJP-JiRbR6pT458Km
- 3EBFA131-D456-4498-9835-0889A1E9D078.jpg
- 5e5ee51016f5436e97da2f2c69cfe084.mov
- 7BC83238-1832-49FE-AB5C-CC4D422BE820.jpg
- 147E21BD-178E-4236-AA67-14171A171FA1.jpg
- 41060ADA-E6CE-48B2-9257-20D12FEF8D14.jpg
- B43357AB-508D-4559-8941-0904FB509C94.jpg
- camphoto_1804928587.jpg
- IMG_0683.HEIC
- IMG_0684.HEIC
- IMG_0685.HEIC
- IMG_0692.HEIC
- IMG_0693.MOV
- IMG_0695.HEIC
- IMG_0700.HEIC
- IMG_0704.HEIC
- IMG_0710.HEIC

## ⚠️ Notas importantes

1. **Solo imágenes**: Los archivos .HEIC y .MOV no funcionarán como imágenes
2. **Tamaño**: Las imágenes muy grandes pueden tardar en cargar
3. **Permisos**: Asegúrate de que las imágenes sean públicas
4. **Backup**: Mantén las imágenes locales como respaldo

## 🚀 Alternativa: Subir al proyecto

Si prefieres no usar Google Drive, puedes:
1. Descargar las imágenes
2. Subirlas a `branding/events/`
3. Usar rutas relativas como `branding/events/tu-imagen.jpg` 