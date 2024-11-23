/**
 * @NApiVersion 2.0
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 */
define(['N/search', 'N/record'], function(search, record) {

    function getInputData() {
        return search.create({
            type: 'customer',
            columns: ['internalid']
        });
    }

    function map(context) {
        var customerId = JSON.parse(context.value).id;
        var orderSearch = search.create({
            type: 'customtransaction_orden_servicio',
            filters: [['custbody_cliente', 'anyof', customerId]],
            columns: [
                'custbody_cliente',
                'item', 
                'amount'
            ]
        });

        var totalSpent = 0;
        var hasProfessionalInstrument = false;
        var hasAnyInstrument = false;

        orderSearch.run().each(function(order) {
            var itemId = order.getValue('item');
            var amount = parseFloat(order.getValue('amount')) || 0;

            totalSpent += amount;

            var itemSearch = search.lookupFields({
                type: 'item',
                id: itemId,
                columns: ['custitem_category', 'custitem_type'] 
            });

            if (itemSearch.custitem_category === 'Profesional') {
                hasProfessionalInstrument = true;
            }
            if (itemSearch.custitem_type === 'Instrumento') {
                hasAnyInstrument = true;
            }

            return true; 
        });

        
        var customerType = 'Principiante'; 
        if (hasProfessionalInstrument && totalSpent > 5000) {
            customerType = 'Profesional';
        } else if (hasAnyInstrument && totalSpent >= 1000 && totalSpent <= 5000) {
            customerType = 'Avanzado';
        } else if (hasAnyInstrument && totalSpent < 1000) {
            customerType = 'Intermedio';
        }

        context.write({
            key: customerId,
            value: customerType
        });
    }
    function reduce(context) {
        var customerId = context.key;
        var customerType = context.values[0]; 

        record.submitFields({
            type: 'customer',
            id: customerId,
            values: {
                custentity_tipo_cliente: customerType
            }
        });
    }

    return {
        getInputData: getInputData,
        map: map,
        reduce: reduce
    };
});
