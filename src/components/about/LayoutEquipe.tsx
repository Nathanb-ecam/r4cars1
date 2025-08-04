import Image from "next/image";

type Props = {
  children?: React.ReactNode;
className?: string;
};

export function LayoutEquipe({ children, className }: Props) {
    return (
      <div className={`w-full  ${className}`}>
        <div className="flex md:flex-row flex-col w-full gap-2">
          <div className='md:w-1/2 max-w-1/2 flex flex-col md:flex-row gap-10 my-10 md:my-0'>
            <Image className='rounded-full bg-gray-50' src="/brand-images/logo_entier_alt2.svg" alt="Rémi Callewaert" width={120} height={120} />
            <div className=''>              
              <h3 className='tracking-tight text-lg font-bold'>Rémi Callewaert</h3>
              <p className='mb-2 text-gray-700 tracking-wide font-light'>Directeur général</p>
              <p className='text-gray-700 leading-snug'>Fondateur et visionnaire en chef, Tony est le moteur de l'entreprise. Il aime rester occupé en participant au développement des stratégies de vente, marketing et d'expérience client.</p>
            </div>
          </div>
          <div className='md:w-1/2 max-w-1/2 flex flex-col md:flex-row gap-10 my-10 md:my-0'>
            <Image className='rounded-full bg-gray-50' src="/brand-images/logo_entier_alt2.svg" alt="Membre de l'équipe 2" width={120} height={120} />
            <div className=''>              
              <h3 className='tracking-tight leading-relax text-lg font-bold'>Rémi Callewaert</h3>
              <p className='mb-2 text-gray-700 tracking-wide font-light'>Directeur général</p>
              <p className='text-gray-700 leading-snug'>Mich adore relever des défis. Fort de son expérience de plusieurs années en tant que directeur commercial dans l'industrie automobile, Mich a aidé l'entreprise à en arriver là où elle en est aujourd'hui. Mich fait partie des meilleurs esprits.</p>
            </div>
          </div>
        </div>
      </div>
    );
}