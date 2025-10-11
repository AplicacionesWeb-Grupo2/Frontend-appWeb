
export const subscriptionService = {
    getPlans() {
        return [
            {
                id: 1,
                name: "Gratis",
                price: "S/ 0",
                features: [
                    "Acceso limitado al chatbot",
                    "Reservas básicas",
                    "Soporte por correo"
                ],
            },
            {
                id: 2,
                name: "Básico",
                price: "S/ 19.90 / mes",
                features: [
                    "Acceso completo al chatbot",
                    "Reservas ilimitadas",
                    "Soporte prioritario"
                ],
            },
            {
                id: 3,
                name: "Premium",
                price: "S/ 39.90 / mes",
                features: [
                    "Todo del plan Básico",
                    "Recomendaciones personalizadas",
                    "Asistencia en tiempo real"
                ],
            },
        ];
    },
};
