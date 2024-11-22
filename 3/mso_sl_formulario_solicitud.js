/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 */
define(['N/ui/serverWidget', 'N/record', 'N/search'], function (serverWidget, record, search) {
    function onRequest(context) {
        if (context.request.method === 'GET') {
            var form = serverWidget.createForm({
                title: 'Solicitud de Servicio'
            });

            var clienteField = form.addField({
                id: 'custpage_cliente',
                type: serverWidget.FieldType.SELECT,
                label: 'Cliente'
            });

            var customerSearch = search.create({
                type: search.Type.CUSTOMER,
                columns: ['internalid', 'entityid', 'custentity_tipo_cliente'] 
            });

            clienteField.addSelectOption({ value: '', text: 'Seleccionar Cliente' });
            customerSearch.run().each(function (result) {
                var clienteId = result.getValue({ name: 'internalid' });
                var clienteNombre = result.getValue({ name: 'entityid' });
                var tipoCliente = result.getValue({ name: 'custentity_tipo_cliente' }) || 'Sin Tipo';
                clienteField.addSelectOption({
                    value: clienteId,
                    text: clienteNombre + ' (' + tipoCliente + ')'
                });
                return true;
            });

            form.addField({
                id: 'custrecord_fecha_solicitud',
                type: serverWidget.FieldType.DATE,
                label: 'Fecha de Solicitud'
            });

            form.addField({
                id: 'custrecord_instrumento',
                type: serverWidget.FieldType.SELECT,
                label: 'Instrumento'
            });

            form.addField({
                id: 'custrecord_descripcion',
                type: serverWidget.FieldType.TEXTAREA,
                label: 'Descripción del Servicio'
            });

            var estadoField = form.addField({
                id: 'custrecord_estado',
                type: serverWidget.FieldType.SELECT,
                label: 'Estado'
            });

            estadoField.addSelectOption({ value: '', text: 'Seleccionar Estado' });
            ['Recibida', 'En Diagnóstico', 'En Reparación', 'Lista para Entrega', 'Entregada'].forEach(function (estado, index) {
                estadoField.addSelectOption({
                    value: String(index + 1),
                    text: estado
                });
            });
            context.response.writePage(form);
        }
    }

    return {
        onRequest: onRequest
    };
});
