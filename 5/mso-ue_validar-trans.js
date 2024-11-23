/**
 * @NApiVersion 2.0
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/error'], function(error) {
    
    function beforeSubmit(context) {
        try {
            if (context.type === context.UserEventType.CREATE || 
                context.type === context.UserEventType.EDIT) {
                
                var newRecord = context.newRecord;

                var total = newRecord.getValue({
                    fieldId: 'custbody_total'
                }) || 0;
                if (parseFloat(total) <= 0) {
                    throw error.create({
                        name: 'TOTAL_INVALIDO',
                        message: 'El total debe ser mayor a 0',
                        notifyOff: false 
                    });
                }
            }
        } catch (e) {
            throw e;
        }
    }
    return {
        beforeSubmit: beforeSubmit
    };
});
