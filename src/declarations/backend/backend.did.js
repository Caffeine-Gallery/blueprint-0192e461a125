export const idlFactory = ({ IDL }) => {
  const StyleProperties = IDL.Record({
    'backgroundColor' : IDL.Text,
    'color' : IDL.Text,
    'fontSize' : IDL.Text,
    'padding' : IDL.Text,
  });
  const Component = IDL.Record({
    'x' : IDL.Float64,
    'y' : IDL.Float64,
    'id' : IDL.Text,
    'styles' : StyleProperties,
    'content' : IDL.Text,
    'type' : IDL.Text,
  });
  return IDL.Service({
    'addComponent' : IDL.Func([Component], [], []),
    'deleteComponent' : IDL.Func([IDL.Text], [], []),
    'getComponent' : IDL.Func([IDL.Text], [IDL.Opt(Component)], ['query']),
    'loadLayout' : IDL.Func([], [IDL.Vec(Component)], ['query']),
    'saveLayout' : IDL.Func([IDL.Vec(Component)], [], []),
    'updateComponent' : IDL.Func([Component], [], []),
  });
};
export const init = ({ IDL }) => { return []; };
