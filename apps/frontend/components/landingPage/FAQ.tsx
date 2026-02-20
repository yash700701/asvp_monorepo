import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "./accordion"

export default function FAQ() {
    return (
        <section className="py-10 text-[#171717]">
            <div className="max-w-7xl mx-auto px-6 md:px-20 grid md:grid-cols-2 gap-20 items-start">

                {/* LEFT SIDE */}
                <div>
                    <p className="text-sm italic text-gray-600 mb-4">
                        Got Questions?
                    </p>

                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
                        Here are the answers.
                    </h2>

                    <p className="mt-6 text-lg text-zinc-600 max-w-md">
                        Everything you need to know about AI visibility and how ASVP
                        helps your brand stay ahead of competitors in AI-driven search.
                    </p>

                    <button className="mt-8 px-6 py-3 bg-black text-white rounded-full text-sm font-medium shadow-md hover:shadow-lg transition">
                        Contact Us
                    </button>
                </div>

                {/* RIGHT SIDE */}
                <div>
                    <Accordion
                        type="single"
                        collapsible
                        className="w-full divide-y divide-zinc-200"
                    >

                        <AccordionItem value="item-1">
                            <AccordionTrigger className="text-left py-6 text-lg font-medium">
                                What is ASVP?
                            </AccordionTrigger>
                            <AccordionContent className="pb-6 text-zinc-600 leading-relaxed">
                                ASVP helps brands understand how AI models like ChatGPT
                                describe, recommend, and rank them.
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-2">
                            <AccordionTrigger className="text-left py-6 text-lg font-medium">
                                How is ASVP different from traditional SEO tools?
                            </AccordionTrigger>
                            <AccordionContent className="pb-6 text-zinc-600 leading-relaxed">
                                Traditional SEO tools optimize for Google rankings.
                                ASVP focuses on AI-generated answers and recommendations.
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-3">
                            <AccordionTrigger className="text-left py-6 text-lg font-medium">
                                Which AI models does ASVP monitor?
                            </AccordionTrigger>
                            <AccordionContent className="pb-6 text-zinc-600 leading-relaxed">
                                ASVP evaluates major AI systems and continuously adapts
                                as generative models evolve.
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-4">
                            <AccordionTrigger className="text-left py-6 text-lg font-medium">
                                Can I cancel anytime?
                            </AccordionTrigger>
                            <AccordionContent className="pb-6 text-zinc-600 leading-relaxed">
                                Yes. You can cancel anytime directly from your dashboard.
                            </AccordionContent>
                        </AccordionItem>

                    </Accordion>
                </div>

            </div>
        </section>
    )
}
