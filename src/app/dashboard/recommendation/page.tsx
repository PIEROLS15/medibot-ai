import Header from '@/components/layout/header'
import RecommendationForm from '@/components/layout/recommendation/recomendacion-form'

const Recommendation = () => {
    return (
        <>
            <div className="space-y-6 pt-10">
                <Header
                    title="Recomendación de medicamentos"
                    description="Complete el formulario con los datos del cliente para generar una recomendación"
                    button={null}
                />

                <RecommendationForm />

            </div>
        </>
    )
}

export default Recommendation
