export default () => (
  <Tooltip opacity={1} sticky={true}>
    <div style={{ display: 'flex' }}>
      <RetinaImage src="./ElmTree.jpg" />
      <div style={{ padding: '6px' }}>
        <div style={{ fontWeight: 'bold' }}>{pub.label}</div>
        <div>A pub</div>
      </div>
    </div>
  </Tooltip>
);
