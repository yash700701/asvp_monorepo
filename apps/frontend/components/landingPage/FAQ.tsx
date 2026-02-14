import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "./accordion"

export default function FAQ() {
    return (
        <section className="py-10 text-[#171717]">
            <div className="max-w-7xl mx-auto px-6">
                <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
                <Accordion type="single" collapsible className="w-full space-y-4">

                    <AccordionItem value="item-1">
                        <AccordionTrigger>What is ASVP?</AccordionTrigger>
                        <AccordionContent>
                            ASVP (AI Search Visibility Platform) helps brands understand how AI models
                            like ChatGPT and other generative systems describe, recommend, and rank them.
                            It reveals where competitors are gaining visibility — and shows you how to fix it.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2">
                        <AccordionTrigger>How is ASVP different from traditional SEO tools?</AccordionTrigger>
                        <AccordionContent>
                            Traditional SEO tools optimize for Google rankings. ASVP focuses on AI-driven
                            responses and recommendations. We analyze how AI models interpret your brand
                            and provide specific actions to improve visibility in AI-generated answers.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-3">
                        <AccordionTrigger>Which AI models does ASVP monitor?</AccordionTrigger>
                        <AccordionContent>
                            ASVP evaluates how major AI systems reference your brand across generative
                            search experiences. Our platform continuously adapts as AI models evolve
                            to ensure your visibility insights stay relevant.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-4">
                        <AccordionTrigger>Who is ASVP built for?</AccordionTrigger>
                        <AccordionContent>
                            ASVP is designed for growth teams, marketing leaders, founders, and
                            enterprise brands that want to stay visible in AI-driven search environments
                            before competitors dominate the space.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-5">
                        <AccordionTrigger>How quickly can we see insights?</AccordionTrigger>
                        <AccordionContent>
                            Once your brand is added, ASVP begins analyzing AI mentions and
                            competitive positioning. Initial insights are typically available within minutes.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-6">
                        <AccordionTrigger>Does ASVP store or access sensitive data?</AccordionTrigger>
                        <AccordionContent>
                            No. ASVP analyzes publicly available AI responses and does not access
                            private company data. We prioritize security and privacy at every layer
                            of the platform.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-7">
                        <AccordionTrigger>Is ASVP suitable for enterprise teams?</AccordionTrigger>
                        <AccordionContent>
                            Yes. ASVP is built with scalability in mind and supports enterprise
                            workflows, competitive monitoring, and long-term AI visibility strategy.
                        </AccordionContent>
                    </AccordionItem>

                </Accordion>

            </div>
        </section>
    );
}

