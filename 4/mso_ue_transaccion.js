/**
 * @NApiVersion 2.0
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/search', 'N/error'], function(record, search, error) {
    
    function calculateTotal(rec) {
        var total = 0;
        var lineCount = rec.getLineCount({
            sublistId: 'item'
        });

        for (var i = 0; i < lineCount; i++) {
            var amount = rec.getSublistValue({
                sublistId: 'item',
                fieldId: 'quantity',
                line: i
            }) || 0;
            total += parseFloat(amount);
        }
        return total;
    }

    function beforeSubmit(context) {
        try {
            if (context.type === context.UserEventType.CREATE ||
                context.type === context.UserEventType.EDIT) {
                
                var newRecord = context.newRecord;
                var total = calculateTotal(newRecord);
                newRecord.setValue({
                    fieldId: 'custbody_total',
                    value: total
                });
            }
        } catch (e) {
            throw error.create({
                name: 'ORDEN_SERVICIO_ERROR',
                message: e.message
            });
        }
    }

    function crearOrdenServicio(context) {
        try {
            // Crear nueva Orden de Servicio
            estado = ["Recibida","En Diagnóstico","En Reparación","Lista para Entrega","Entregada"]

            var ordenServicio = record.create({
                type: 'customtransaction_orden_servicio',
                isDynamic: true
            });

            ordenServicio.setValue({
                fieldId: 'custbody_cliente',
                value: context.newRecord.id 
            });

            ordenServicio.setValue({
                fieldId: 'custbody_fecha_orden',
                value: new Date()
            });

            ordenServicio.setValue({
                fieldId: 'custbody_estado_orden',
                value: estado[0] 
            });

            var instrumento = [];
            var instrumentoPrice = [];
            var instrumentoSearch = search.create({
                type: 'item',
                filters: [
                    ['type', 'is', 'InventoryItem'], 
                ],
                columns: ['instrumentoid','instrumentoPrice']
            });

            instrumentoSearch.run().each(function(result) {

                ordenServicio.selectNewLine({sublistId: 'item'});

                ordenServicio.setCurrentSublistValue({sublistId: 'item',fieldId: 'item',value: result.getValue('internalid') });

                ordenServicio.setCurrentSublistValue({sublistId: 'item',fieldId: 'quantity',value: 1});

                ordenServicio.setCurrentSublistValue({sublistId: 'item',fieldId: 'rate',value: result.getValue('instrumentoPrice') });

                ordenServicio.commitLine({sublistId: 'item'});
                return true;
            }

            var ordenId = ordenServicio.save({
                enableSourcing: true,
                ignoreMandatoryFields: false
            });

            return ordenId;

        } catch (e) {
            throw error.create({
                name: 'ORDEN_SERVICIO_ERROR',
                message: e.message
            });
        }
    }

    return {
        beforeSubmit: beforeSubmit,
        crearOrdenServicio: crearOrdenServicio
    };
});