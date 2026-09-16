# Fotos de la galería

Las ocho fotos ya están colocadas y optimizadas. Se muestran en una retícula de
4 x 2 en escritorio y de 2 columnas en móvil, todas en formato vertical 3:4.

| Archivo             | Qué muestra                                   |
|---------------------|-----------------------------------------------|
| `salon.jpg`         | El salón: muros verdes, banca de terciopelo   |
| `nogada.jpg`        | Chile en nogada                               |
| `panbrioche.jpg`    | Pan francés de brioche                        |
| `flores.jpg`        | Arreglo floral junto al tibor azul            |
| `outside.jpg`       | La terraza                                    |
| `enchiladas.jpg`    | Enchiladas de mole                            |
| `avocadosalmon.jpg` | Tostada de salmón y aguacate                  |
| `panaderia.jpg`     | Galletas rellenas                             |

## Originales

`_originals/` guarda los archivos tal como los entregaste (16,4 MB en total,
3072x4096). Las copias de esta carpeta se redujeron a 1200x1600, calidad 82,
progresivas y sin metadatos: **16,4 MB → 2,0 MB**, sin diferencia visible en
pantalla.

**Borra `_originals/` antes de subir el sitio**, o se publicarán 16 MB que nadie
va a descargar. Guárdala en otro lado si quieres conservarla.

## Cambiar o añadir una foto

1. Pon el archivo aquí en formato vertical 3:4, ~1600 px de alto, bajo 400 KB.
2. Edita el `<figure class="shot">` correspondiente en la sección `#galeria` de
   `index.html`: `src`, `alt`, `data-en-alt` y la leyenda.

La retícula recorta con `object-fit: cover`, así que conviene dejar el motivo
cerca del centro. Si un archivo falta, el hueco se dibuja como un marco punteado
con el nombre del archivo que espera, en vez de romper la página.
