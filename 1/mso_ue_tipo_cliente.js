/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 */
define(['N/log'], function(log) {
    function beforeLoad(context) {
        try {
            if (context.type !== context.UserEventType.CREATE) {
                return;
            }
            var form = context.form;
            var currentRecord = context.newRecord;
            var tipoClienteField = form.getField({
                id: 'custentity_tipo_cliente'
            });
            
            if (tipoClienteField) {
                tipoClienteField.isMandatory = true;                
                log.debug({title: 'Exitoso',details: 'El campo Tipo de Cliente se configuro correctamente'});
            } else {
                log.error({title: 'El campo no existe',details: 'No se encontro custentity_tipo_cliente'});
            }
        } catch (error) {
            log.error({title: 'Error en el script',details: error});
        }
    }
    return {
        beforeLoad: beforeLoad
    };
});