import YamlBookWrapper from '../../components/YamlBookWrapper';

/**
 * SkywardBound book component
 *
 * Displays an interactive storybook about a mother bear who works with airplanes
 * and returns to her princess daughter after her adventures in the sky.
 */
export default function SkywardBound(): JSX.Element {
  return <YamlBookWrapper yamlFileName="skyward-bound.yaml" />;
}
