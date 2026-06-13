import partnerImage from "@/assets/partner.png";
import partner2Image from "@/assets/partner2.jpg";
import part3Image from "@/assets/part3.png";

const partners = [
  {
    name: "IIT ROPAR",
    logo: partnerImage,
    description: "A trusted partner in sustainable solutions.",
  },
  {
    name: "ELECTROPRENEUR PARK",
    logo: partner2Image,
    description: "Another trusted partner in sustainable solutions.",
  },
  {
    name: "VISHNU TBI",
    logo: part3Image,
    description: "A trusted partner in sustainable solutions.",
  },
];

export const Partners = () => {
  return (
    <section id="partners" className="py-24 bg-background relative">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-primary font-medium mb-4 tracking-wider uppercase text-sm">
            Our Partners
          </p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Collaborating for a Sustainable Future
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            We work with leading organizations to deliver innovative solutions that make a real impact.
          </p>
        </div>

        {/* Partners Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="group relative bg-card rounded-2xl p-8 shadow-card hover:shadow-glow transition-all duration-500 border border-border hover:border-primary/30"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-ocean rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="w-32 h-32 bg-accent rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 mx-auto">
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="w-28 h-28 object-contain"
                />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-4 text-center">
                {partner.name}
              </h3>
              <p className="text-muted-foreground leading-relaxed text-center">
                {partner.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
