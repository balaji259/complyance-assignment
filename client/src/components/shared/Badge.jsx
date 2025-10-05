import React from 'react';


function Badge({ type }) {
  const getLabel = () => {
    switch (type) {
      case 'number': return '123';
      case 'date': return '📅';
      case 'text': return 'ABC';
      case 'empty': return '—';
      default: return type;
    }
  };

  return (
    <span className={`type-badge ${type}`}>
      {getLabel()}
    </span>
  );
}

export default Badge;
