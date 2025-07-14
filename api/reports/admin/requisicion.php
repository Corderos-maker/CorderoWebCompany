<?php
// Se incluye la clase con las plantillas para generar reportes.
require_once('../../helpers/report.php');

// Se instancia la clase para crear el reporte.
$pdf = new Report;
// Se verifica si existe un valor para la requisicion, de lo contrario se muestra un mensaje.
if (isset($_GET['idRequisicion'])) {
    // Se incluyen las clases para la transferencia y acceso a datos.
    require_once('../../models/data/data_requisicion.php');
    // Se instancian las entidades correspondientes.
    $requisicion = new requisicionData;
    // Se establece el valor de la categoría, de lo contrario se muestra un mensaje.
    if ($requisicion->setIdRequisicion($_GET['idRequisicion'])) {
        // Se verifica si la categoría existe, de lo contrario se muestra un mensaje.
        if ($rowRequisicion = $requisicion->readOne()) {
            // Se inicia el reporte con el encabezado del documento.
            $pdf->startReport('Requisicion pedido por ' . '"'.$rowRequisicion['usuario_dupla'].'"');
            if ($dataRequisicion = $requisicion->readByOrder()) {
                // Ordenar los materiales por categoría (por si acaso)
                usort($dataRequisicion, function($a, $b) {
                    return strcmp($a['categoria_material'], $b['categoria_material']);
                });

                $pdf->setFont('Arial', 'B', 11);
                $pdf->setFillColor(225);
                // Encabezados de la tabla
                $pdf->cell(30, 10, 'STOCK', 1, 0, 'C', 1);
                $pdf->cell(126, 10, 'DESCRIPCION', 1, 0, 'C', 1);
                $pdf->cell(30, 10, 'CANTIDAD', 1, 1, 'C', 1);

                $pdf->setFont('Arial', '', 11);

                $categoriaActual = '';
                foreach ($dataRequisicion as $row) {
                    if ($row['categoria_material'] !== $categoriaActual) {
                        $categoriaActual = $row['categoria_material'];
                        // Fila de separación de categoría
                        $pdf->setFillColor(200, 200, 200); // Gris claro
                        $pdf->setFont('Arial', 'B', 11);
                        $pdf->cell(186, 8, $pdf->encodeString("$categoriaActual"), 1, 1, 'C', 1);
                        $pdf->setFont('Arial', '', 11);
                        $pdf->setFillColor(225); // Regresa al color de encabezado normal
                    }
                    // Fila normal de material
                    $pdf->cell(30, 10, $pdf->encodeString($row['codigo_material']), 1, 0);
                    $pdf->cell(126, 10, $pdf->encodeString($row['nombre_material']), 1, 0);
                    $pdf->cell(30, 10, $row['cantidad_total'], 1, 1);
                }
            } else {
                $pdf->cell(0, 10, $pdf->encodeString('No hay materiales para la requisicion'), 1, 1);
            }
        } else {
            print('Categoría inexistente');
        }
    } else {
        print('Categoría incorrecta');
    }
} else {
    print('Debe seleccionar una requisicion');
}
$pdf->Output();