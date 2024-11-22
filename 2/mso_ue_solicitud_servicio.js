/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 */

 define(['N/record','N/search'], function(record, search) {
    function createCustomRecord(context) {
        try {
            var solicitudServicio = record.create({
                type: 'customrecord_solicitud_servicio', 
                isDynamic: true
            });

            var instrumento = [];
            var instrumentoSearch = search.create({
                type: 'item',
                filters: [
                    ['type', 'is', 'InventoryItem'], 
                ],
                columns: ['instrumentoid']
            });
            instrumentoSearch.run().each(function(result) {
                instrumento.push(result.getValue('instrumentoid'));
                return true; 
            });

            estado = [            
                "Recibida",
                "En Diagnóstico",
                "En Reparación",
                "Lista para Entrega",
                "Entregada"
            ]

            solicitudServiciosolicitudServicio.setValue('custrecord_cliente',context.newRecord.id);
            solicitudServiciosolicitudServicio.setValue('custrecord_fecha_solicitud', new Date());
            solicitudServiciosolicitudServicio.setValue('custrecord_instrumento', instrumento[0]);
            solicitudServiciosolicitudServicio.setValue('custrecord_descripcion','' );
            solicitudServicio.setValue('custrecord_estado', estado[0]);
            
            var recordId = solicitudServicio.save();
            return recordId;
        } catch (error) {
            throw error;
        }
    }

    return {
        beforeSubmit: createCustomRecord
    };
});
