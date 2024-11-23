/**
 * @NApiVersion 2.0
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/ui/message', 'N/ui/dialog'], function(message, dialog) {

    
    const palabrasOfensivas = ['abcd', 'efg', 'hijk']; 

    function validateField(context) {
        if (context.fieldId === 'custrecord_descripcion') {
            var descripcion = context.currentRecord.getValue({
                fieldId: 'custrecord_descripcion'
            });

            if (descripcion.length < 30) {
                dialog.alert({
                    title: 'Error de Validación',
                    message: 'Minimo 30 caracteres.'
                });
                return false;
            }

            for (var i = 0; i < palabrasOfensivas.length; i++) {
                if (descripcion.toLowerCase().includes(palabrasOfensivas[i].toLowerCase())) {
                    dialog.alert({
                        title: 'Error de Validación',
                        message: `No se permiten palabras ofensivas: "${palabrasOfensivas[i]}".`
                    });
                    return false;
                }
            }
        }
        return true;
    }

    function saveRecord(context) {
        var descripcion = context.currentRecord.getValue({
            fieldId: 'custrecord_descripcion'
        });

        if (descripcion.length < 30) {
            dialog.alert({
                title: 'Error de Validación',
                message: 'Minimo 30 caracteres.'
            });
            return false;
        }

        for (var i = 0; i < palabrasOfensivas.length; i++) {
            if (descripcion.toLowerCase().includes(palabrasOfensivas[i].toLowerCase())) {
                dialog.alert({
                    title: 'Error de Validación',
                    message: `No se permiten palabras ofensivas:: "${palabrasOfensivas[i]}".`
                });
                return false;
            }
        }

        return true;
    }

    return {
        validateField: validateField,
        saveRecord: saveRecord
    };
});
