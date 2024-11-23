/**
 * @NApiVersion 2.0
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/search', 'N/log'], function(record, search, log) {

    function afterSubmit(context) {
        try {
            if (context.type !== context.UserEventType.CREATE) {
                return;
            }

            var newRecord = context.newRecord;

            var clienteId = newRecord.getValue('custbody_cliente');
            var fechaOrden = newRecord.getValue('custbody_fecha_orden');

            var lineCount = newRecord.getLineCount({ sublistId: 'item' });
            var instrumentoEncontrado = false;
            var primerInstrumentoId = null;

            for (var i = 0; i < lineCount; i++) {
                var itemId = newRecord.getSublistValue({
                    sublistId: 'item',
                    fieldId: 'item',
                    line: i
                });

                var itemType = search.lookupFields({
                    type: 'item',
                    id: itemId,
                    columns: ['custitem_type']
                });

                if (itemType.custitem_type === 'Instrumento') {
                    instrumentoEncontrado = true;
                    primerInstrumentoId = itemId;
                    break;
                }
            }


            if (!instrumentoEncontrado) {
                log.debug('No instrumento', 'No hay instrumentos');
                return;
            }
            var solicitudServicio = record.create({
                type: 'customrecord_solicitud_servicio',
                isDynamic: true
            });

            solicitudServicio.setValue({
                fieldId: 'custrecord_cliente',
                value: clienteId
            });

            solicitudServicio.setValue({
                fieldId: 'custrecord_fecha_solicitud',
                value: fechaOrden
            });

            solicitudServicio.setValue({
                fieldId: 'custrecord_instrumento',
                value: primerInstrumentoId
            });

            solicitudServicio.setValue({
                fieldId: 'custrecord_estado',
                value: 'Recibida' 
            });

            var solicitudId = solicitudServicio.save({
                enableSourcing: true,
                ignoreMandatoryFields: false
            });

            log.debug('Solicitud Creada', 'ID: ' + solicitudId);

        } catch (e) {
            log.error('Error: ', e.message);
        }
    }

    return {
        afterSubmit: afterSubmit
    };
});
