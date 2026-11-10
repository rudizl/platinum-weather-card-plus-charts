// Kilometres in one unit of a distance, for the units Home Assistant gives one in; a unit it does not know, or none, is a kilometre.
// The lightning detector is read in the unit of its entity (#38), and its colours and its default range are in kilometres.
export function kmPer(unit: string | undefined): number {
  switch ((unit ?? '').trim().toLowerCase()) {
    case 'mi':
    case 'mile':
    case 'miles': return 1.609344;
    case 'nmi': return 1.852;
    case 'yd': return 0.0009144;
    case 'ft': return 0.0003048;
    case 'm': return 0.001;
    case 'cm': return 0.00001;
    case 'mm': return 0.000001;
    case 'in': return 0.0000254;
    default: return 1;
  }
}
