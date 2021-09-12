export function getLogicalSign(id: string): string {
  switch (id) {
    case 'not':
      return '!==';
    case 'not contain':
    case 'contain':
      return 'includes';
    case 'moreThan':
      return '>';
    case 'lessThan':
      return '<';
    default:
      return '';
  }
}

export function getScriptCondition(logicalSign: string, value: string, parentWindowOrigin: string): boolean {
  switch (logicalSign) {
    case '!==':
      return eval(`"${parentWindowOrigin}" ${logicalSign} "${value}"`);
    case 'includes':
      return !parentWindowOrigin.includes(value);
    default:
      return parentWindowOrigin.includes(value);
  }
}